
const getHostName = () => {
  const hostname = window.location.hostname;
  const domainMap = {
    localhost: 'http://localhost:8080',
    coalquilando: 'https://ec2-34-219-1-255.us-west-2.compute.amazonaws.com:8080',
    pwa: "http://192.168.0.5:8080",
  }
  return domainMap[hostname] || domainMap.coalquilando;
}

const hostname = getHostName()

export default hostname;