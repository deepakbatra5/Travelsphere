# Deploying Travelsphere to EC2 (Elastic IP + CI/CD + Monitoring)

This file describes the minimal steps and required GitHub Secrets to deploy this project to an Ubuntu EC2 instance with an Elastic IP, and run Prometheus + Grafana accessible via that IP.

AWS CLI identity checked on this machine
- AWS account ID: `522614117562`
- IAM principal: `arn:aws:iam::522614117562:user/fullstack-cicd-project`
- Default region: `us-east-1`

Live AWS resources discovered
- Candidate app EC2 instance: `i-043afcc8a1ac57060`
- Current public IP on that instance's primary ENI: `34.204.194.77`
- Private IP on that instance: `192.168.28.207`
- Existing Elastic IP in the account: `18.210.84.124`
- That Elastic IP is currently attached to an EKS NAT interface, so it should not be reused for this app

Required GitHub secrets
- `EC2_HOST` — use `34.204.194.77` for the currently discovered EC2 instance, or replace with the new Elastic IP once one is allocated for this app
- `EC2_USER` — SSH user, usually `ubuntu` for Ubuntu AMIs
- `SSH_PRIVATE_KEY` — private key for `EC2_USER` in PEM format
- `EC2_INSTANCE_ID` — `i-043afcc8a1ac57060` if you want to deploy to the instance I found
- `AWS_ACCESS_KEY_ID` — access key for the IAM user or role that can manage EIP association
- `AWS_SECRET_ACCESS_KEY` — secret key paired with `AWS_ACCESS_KEY_ID`
- `AWS_REGION` — use `us-east-1` unless you intentionally deploy elsewhere
- `GF_SECURITY_ADMIN_PASSWORD` — optional Grafana admin password; if omitted, the compose file defaults to `admin`

Security group requirements
- Allow inbound TCP: `22` (SSH), `80` (HTTP), `443` (HTTPS), `3000` (Grafana), `9090` (Prometheus) from your trusted sources.

Steps (summary)
1. Launch an Ubuntu 22.04/24.04 EC2 instance and note the `InstanceId`.
2. Create/assign a key pair and add the private key to `SSH_PRIVATE_KEY` secret.
3. (Optional) Run the `provision-eip` workflow manually to allocate and associate a *new* Elastic IP. Provide AWS secrets and `EC2_INSTANCE_ID`. Do not reuse the existing `18.210.84.124` EIP because it is the NAT IP for the EKS cluster.
4. Ensure the EC2 has Docker and Docker Compose installed if you plan to run the monitoring stack; the `deployment/deploy.sh` script installs Node, PostgreSQL, PM2, Nginx and certbot.
5. Push to `main` branch — the `CI / CD` workflow will build and copy the repo to `/home/$EC2_USER/travelsphere` and then run `deployment/deploy.sh`.
6. To start the monitoring stack on the EC2 host (after deploy), SSH to the server and run:

```bash
cd /home/$EC2_USER/travelsphere
docker compose -f docker-compose.yml -f deployment/docker-compose.monitor.yml up -d
```

Notes and adjustments
- The `deployment/deploy.sh` script assumes Ubuntu and will install Node, PostgreSQL, PM2, Nginx and obtain TLS certificates via Certbot. Review and update environment placeholders in `deployment/deploy.sh` before first run.
- The Prometheus config uses `host.docker.internal:3000` as a default scrape target. On Linux EC2 hosts, replace it with the host's private IP or expose a node exporter/app metrics endpoint.
- If you want the workflow to manage Elastic IP association automatically, the AWS IAM user needs `ec2:AllocateAddress`, `ec2:AssociateAddress`, `ec2:DisassociateAddress`, `ec2:DescribeAddresses`, `ec2:DescribeInstances`, and `ec2:DescribeNetworkInterfaces` permissions.
- The attempted reassociation failed with `AuthFailure`, so the current AWS user does not yet have enough permission to rebind an EIP.
- If you prefer not to copy the full repo via SCP, the deploy step can be changed to SSH into the instance and perform a `git pull` instead.

If you'd like, I can:
- Add an alternative workflow that SSHes and runs `git pull` instead of SCP.
- Add Terraform or CloudFormation to provision the EC2 instance and Elastic IP automatically.
