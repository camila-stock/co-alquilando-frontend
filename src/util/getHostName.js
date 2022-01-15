
const localhost = 'http://localhost:8080';
const aws = 'https://ec2-34-219-1-255.us-west-2.compute.amazonaws.com:8080';
const pwa = "http://192.168.0.5:8080";

const getHostName = () => {
  const hostname = window.location.hostname;
  const domainMap = {
    localhost: localhost,
    coalquilando: aws,
    pwa,
  }
  return domainMap[hostname] || domainMap.coalquilando;
}

const hostname = getHostName()

export default hostname;