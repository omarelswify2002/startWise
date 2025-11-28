# Deployment Guide - StartWise System

## Overview
This guide provides instructions for deploying the StartWise System to production environments.

## Prerequisites
- Node.js 14+ installed
- MongoDB Atlas account
- Cloudinary account
- Email service (Gmail/SendGrid)
- Domain name (optional)
- Hosting platform account (Vercel, Heroku, AWS, etc.)

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/startwiseDB?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@startwisesystem.com

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# OTP Configuration
OTP_EXPIRE_MINUTES=10
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

## Deployment Options

### Option 1: Vercel (Frontend) + Heroku (Backend)

#### Deploy Backend to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create startwisesystem-api
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set CLOUDINARY_CLOUD_NAME="your_cloud_name"
heroku config:set CLOUDINARY_API_KEY="your_api_key"
heroku config:set CLOUDINARY_API_SECRET="your_api_secret"
heroku config:set EMAIL_HOST="smtp.gmail.com"
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER="your_email@gmail.com"
heroku config:set EMAIL_PASSWORD="your_app_password"
heroku config:set EMAIL_FROM="noreply@startwisesystem.com"
heroku config:set FRONTEND_URL="https://your-frontend.vercel.app"
```

5. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

6. **Verify Deployment**
```bash
heroku logs --tail
heroku open
```

#### Deploy Frontend to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd frontend
vercel
```

4. **Set Environment Variables in Vercel Dashboard**
- Go to Vercel Dashboard
- Select your project
- Go to Settings > Environment Variables
- Add:
  - `VITE_API_URL`: https://startwisesystem-api.herokuapp.com/api
  - `VITE_SOCKET_URL`: https://startwisesystem-api.herokuapp.com

5. **Redeploy**
```bash
vercel --prod
```

---

### Option 2: AWS (Full Stack)

#### Deploy Backend to AWS Elastic Beanstalk

1. **Install AWS CLI and EB CLI**
```bash
pip install awscli awsebcli
```

2. **Configure AWS Credentials**
```bash
aws configure
```

3. **Initialize EB**
```bash
cd backend
eb init -p node.js startwisesystem-api
```

4. **Create Environment**
```bash
eb create startwisesystem-api-env
```

5. **Set Environment Variables**
```bash
eb setenv NODE_ENV=production MONGODB_URI="..." JWT_SECRET="..." ...
```

6. **Deploy**
```bash
eb deploy
```

#### Deploy Frontend to AWS S3 + CloudFront

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://startwisesystem-frontend
```

3. **Upload Build**
```bash
aws s3 sync dist/ s3://startwisesystem-frontend
```

4. **Configure S3 for Static Hosting**
```bash
aws s3 website s3://startwisesystem-frontend --index-document index.html
```

5. **Create CloudFront Distribution** (via AWS Console)

---

### Option 3: DigitalOcean (Full Stack)

#### Deploy Backend

1. **Create Droplet**
- Ubuntu 20.04 LTS
- 2GB RAM minimum

2. **SSH into Droplet**
```bash
ssh root@your_droplet_ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2**
```bash
npm install -g pm2
```

5. **Clone Repository**
```bash
git clone https://github.com/yourusername/startWiseSystem.git
cd startWiseSystem/backend
```

6. **Install Dependencies**
```bash
npm install
```

7. **Create .env File**
```bash
nano .env
# Paste environment variables
```

8. **Start with PM2**
```bash
pm2 start server.js --name startwisesystem-api
pm2 save
pm2 startup
```

9. **Configure Nginx**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/startwisesystem
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.startwisesystem.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. **Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/startwisesystem /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.startwisesystem.com
```

#### Deploy Frontend

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Upload to Droplet**
```bash
scp -r dist/* root@your_droplet_ip:/var/www/startwisesystem
```

3. **Configure Nginx for Frontend**
```nginx
server {
    listen 80;
    server_name startwisesystem.com www.startwisesystem.com;
    root /var/www/startwisesystem;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Setup SSL**
```bash
sudo certbot --nginx -d startwisesystem.com -d www.startwisesystem.com
```

---

## Database Setup

### MongoDB Atlas Configuration

1. **Create Cluster**
- Go to MongoDB Atlas
- Create new cluster
- Choose region closest to your server

2. **Create Database User**
- Database Access > Add New Database User
- Set username and password
- Grant read/write permissions

3. **Whitelist IP Addresses**
- Network Access > Add IP Address
- For production: Add your server's IP
- For development: Add 0.0.0.0/0 (not recommended for production)

4. **Get Connection String**
- Clusters > Connect > Connect your application
- Copy connection string
- Replace <password> with your database password

---

## Cloudinary Setup

1. **Create Account**
- Go to cloudinary.com
- Sign up for free account

2. **Get Credentials**
- Dashboard > Account Details
- Copy:
  - Cloud Name
  - API Key
  - API Secret

3. **Configure Upload Presets** (Optional)
- Settings > Upload
- Create upload preset for different file types

---

## Email Service Setup

### Option 1: Gmail

1. **Enable 2-Factor Authentication**
2. **Generate App Password**
- Google Account > Security > App Passwords
- Select "Mail" and "Other"
- Copy generated password

3. **Use in .env**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=generated_app_password
```

### Option 2: SendGrid

1. **Create Account** at sendgrid.com
2. **Create API Key**
- Settings > API Keys > Create API Key
3. **Update Email Configuration**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Implement input validation
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Whitelist only necessary IPs
- [ ] Keep dependencies updated
- [ ] Enable security headers (helmet)
- [ ] Implement logging and monitoring

---

## Monitoring & Maintenance

### Application Monitoring

1. **PM2 Monitoring**
```bash
pm2 monit
pm2 logs
```

2. **Setup Alerts**
```bash
pm2 install pm2-logrotate
```

### Database Monitoring

1. **MongoDB Atlas Monitoring**
- Metrics > Performance
- Set up alerts for:
  - High CPU usage
  - High memory usage
  - Slow queries

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

---

## Backup Strategy

### Database Backups

1. **MongoDB Atlas Automatic Backups**
- Enabled by default
- Configure retention period

2. **Manual Backups**
```bash
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)
```

### Application Backups

1. **Git Repository**
- Push code regularly
- Tag releases

2. **File Storage**
- Cloudinary has automatic backups
- Consider additional backup service

---

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**
- Use Nginx or AWS ELB
- Distribute traffic across multiple instances

2. **Database Scaling**
- MongoDB Atlas auto-scaling
- Read replicas for read-heavy operations

3. **Caching**
- Implement Redis for session storage
- Cache frequently accessed data

### Vertical Scaling

1. **Increase Server Resources**
- More CPU
- More RAM
- Faster storage

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
- Check FRONTEND_URL in backend .env
- Verify CORS configuration in server.js

2. **Database Connection Failed**
- Check MongoDB URI
- Verify IP whitelist
- Check database user permissions

3. **Email Not Sending**
- Verify SMTP credentials
- Check firewall rules
- Test with different email service

4. **File Upload Fails**
- Check Cloudinary credentials
- Verify file size limits
- Check network connectivity

---

## Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Database connected successfully
- [ ] Email service working
- [ ] File upload working
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Security headers enabled
- [ ] Error logging working
- [ ] Performance optimized
- [ ] Documentation updated

---

## Support & Resources

- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Cloudinary**: https://cloudinary.com/documentation
- **Vercel**: https://vercel.com/docs
- **Heroku**: https://devcenter.heroku.com
- **AWS**: https://docs.aws.amazon.com
- **DigitalOcean**: https://docs.digitalocean.com

---

**Deployment Complete!** 🚀

Your StartWise System is now live and ready to connect startups with investors and advisors!

