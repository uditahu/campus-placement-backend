# Campus Placement Portal — Cloud MPR

**Stack:** React (Vite) + Node.js/Express + MySQL (AWS RDS) + AWS S3

---

## Quick Start (Local Dev)

### 1. Database
```bash
mysql -h <RDS_ENDPOINT> -u admin -p < schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env          # fill in your RDS + S3 values
npm install
node seed.js                  # creates admin@campus.com / Admin@123
npm run dev                   # runs on port 5000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env          # VITE_API_URL=http://localhost:5000
npm install
npm run dev                   # runs on port 5173
```

---

## EC2 Deployment (Ubuntu 24, 13.234.82.22)

### SSH In
```bash
ssh -i ~/udit_cloudd.pem ubuntu@13.234.82.22
```

### Wipe old repo and push fresh code
```bash
# On your machine:
cd campus-placement-portal
git init
git remote add origin https://github.com/uditahu/campus-placement-backend.git
git add .
git commit -m "fresh start: clean rebuild"
git push -f origin main

# On EC2:
cd /home/ubuntu
rm -rf campus-placement-portal
git clone https://github.com/uditahu/campus-placement-backend.git campus-placement-portal
```

### Backend Setup on EC2
```bash
cd /home/ubuntu/campus-placement-portal/backend
cp .env.example .env
nano .env        # fill in RDS endpoint, S3 bucket, etc.

npm install
node seed.js     # seed admin account

# Start with PM2
pm2 delete campus-backend 2>/dev/null || true
pm2 start server.js --name campus-backend
pm2 save
pm2 startup      # copy-paste the output command
```

### Frontend Build on EC2
```bash
cd /home/ubuntu/campus-placement-portal/frontend
cp .env.example .env
# Edit VITE_API_URL=http://13.234.82.22
nano .env

npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### Nginx Config
```bash
sudo nano /etc/nginx/sites-available/default
```
Replace contents with:
```nginx
server {
    listen 80;
    server_name 13.234.82.22;
    root /var/www/html;
    index index.html;

    # Serve React frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API to backend
    location /api/ {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Cookie $http_cookie;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
    }
}
```
```bash
sudo nginx -t && sudo systemctl restart nginx
```

### IAM Role for S3 (fix from previous build)
1. AWS Console → EC2 → Select your instance
2. Actions → Security → Modify IAM Role
3. Attach role with `AmazonS3FullAccess` (or a scoped policy for `campus-resumes-uditahuja`)
4. No AWS keys needed in `.env` on EC2 — the role handles auth automatically.

---

## Test Accounts (after seed.js)
| Role    | Email               | Password  |
|---------|---------------------|-----------|
| Admin   | admin@campus.com    | Admin@123 |

Register students, faculty, and companies via `/register`.

---

## Ports
| Service      | Port |
|--------------|------|
| Backend API  | 5000 |
| Frontend Dev | 5173 |
| Nginx (prod) | 80   |

---

## PM2 Commands
```bash
pm2 list
pm2 logs campus-backend
pm2 restart campus-backend
sudo fuser -k 5000/tcp    # kill port if stuck
```
