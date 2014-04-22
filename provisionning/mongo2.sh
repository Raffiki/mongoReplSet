hostname "mongo2"
echo "mongo2" > /etc/hostname
echo "192.168.33.12 mongo2" >> /etc/hosts
echo "192.168.33.11 mongo1" >> /etc/hosts
echo "192.168.33.13 mongo3" >> /etc/hosts

# get mongodb
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
apt-get update
apt-get -y install mongodb-10gen

service mongodb stop
cp -f /vagrant/provisionning/mongodb.conf.2 /etc/mongodb.conf
service mongodb start
