# Install venv and postgres
sudo apt update
sudo apt install python3-venv postgresql postgresql-contrib -y

# Start postgres service
sudo systemctl start postgresql.service

# Create user and database and set DATABASE_URL in .env
sudo -u postgres psql -c "CREATE ROLE cs3900 PASSWORD 'cs3900' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN"
sudo -u postgres createdb cs3900-terraluna --owner=cs3900
sed -i -e 's#DATABASE_URL=.*#DATABASE_URL=postgresql\+psycopg2://cs3900:cs3900@localhost:5432/cs3900-terraluna#' backend/.env

# Install node using nvm
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
vm install 14.17.3

# Create virtual environment and install requirements
cd backend/
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt

# Run db migrations and seed ingredients and ingredient categories
flask db upgrade
python3 seed.py basic_categories

# Install node packages
cd ../frontend
npm install
