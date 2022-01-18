'use strict';
// const hostname = 'localhost:8080';
const hostname = 'https://ec2-34-219-1-255.us-west-2.compute.amazonaws.com:8080';

function base64UrlToUint8Array(base64UrlData) {
	const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
	const base64 = (base64UrlData + padding).replace(/-/g, '+').replace(/_/g, '/');

	const rawData = atob(base64);
	const buffer = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		buffer[i] = rawData.charCodeAt(i);
	}

	return buffer;
}

function sendSubscriptionToServer(subscription) {
  try {
    let key = subscription.getKey ? subscription.getKey('p256dh') : '';
    let auth = subscription.getKey ? subscription.getKey('auth') : '';
    let { id } = JSON.parse(localStorage.getItem('user'));
    let devicetoken = {
      id,
      endpoint: subscription.endpoint,
      key: JSON.stringify({
        p256dh: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
        auth: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
      })
    };
    subscription = JSON.stringify(subscription);
    JSON.stringify(devicetoken);
  
    let formData = new FormData();
    formData.append('subscriptionJson', subscription);
    formData.append('user', id);
  
    fetch(`${hostname}/notifications/subscribe`, {
      method: 'POST',
      body: formData
    });
    document.querySelector(".sw-status").classList.remove("inactive");
    document.querySelector(".sw-status").classList.add("active");
  } catch (error) {
    console.error("Error", error)
    document.querySelector(".sw-status").classList.remove("active");
    document.querySelector(".sw-status").classList.add("inactive");
  }
}

function subscribe() {
	const publicKey = base64UrlToUint8Array(
		'BAPGG2IY3Vn48d_H8QNuVLRErkBI0L7oDOOCAMUBqYMTMTzukaIAuB5OOcmkdeRICcyQocEwD-oxVc81YXXZPRY'
	);

	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
		serviceWorkerRegistration.pushManager
			.subscribe({
				userVisibleOnly: true,
				applicationServerKey: publicKey
			})
			.then(function(subscription) {
				return sendSubscriptionToServer(subscription);
			})
			.catch(function(e) {
				if (Notification.permission === 'denied') {
					console.error('Permission for Notifications was denied');
				} else {
					console.error('Unable to subscribe to push.', e);
				}
			});
	});
}

self.addEventListener('DOMContentLoaded', function(event) {
  const user = localStorage.getItem('user');
  if (!user) {
    document.querySelector(".sw-status").classList.remove("active");
    document.querySelector(".sw-status").classList.add("inactive");
    return;
  };
  const id = JSON.parse(user).id;
  if (!id) return;
	console.log('DOMContentLoaded', event);
  Notification.requestPermission(function(result) {
		if (result === 'denied') {
			console.error("Permission wasn't granted. Allow a retry.");
			return;
		} else if (result === 'default') {
			console.error('The permission request was dismissed.');
			return;
		}

    navigator.serviceWorker
      .register('/sw.js')
        .then(function(registration) {
          console.log("registration: ", registration)
          navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager
              .getSubscription()
              .then(function(subscription) {
                if (!subscription) {
                  subscribe();
                  return;
                }
                else {
                  sendSubscriptionToServer(subscription);
                  document.querySelector(".sw-status").classList.remove("inactive");
                  document.querySelector(".sw-status").classList.add("active");
                }
              })
          })
        })
        .catch(function(e) {
          console.error("error", e)
          document.querySelector(".sw-status").classList.remove("active");
          document.querySelector(".sw-status").classList.add("inactive");
        })
  })
});
