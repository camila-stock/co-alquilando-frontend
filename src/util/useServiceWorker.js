import { register } from 'register-service-worker';
import hostname from '../util/getHostName'

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
					console.warn('Permission for Notifications was denied');
				} else {
					console.error('Unable to subscribe to push.', e);
				}
			});
	});
}
const useServiceWorker = () => {
	Notification.requestPermission(function(result) {
		if (result === 'denied') {
			console.log("Permission wasn't granted. Allow a retry.");
			return;
		} else if (result === 'default') {
			console.log('The permission request was dismissed.');
			return;
		}

		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
			navigator.serviceWorker
				.register('/sw.js')
				.then(function(registration) {
					//console.log('Service Worker Registered', registration);
					// El usuario permitió Notificaciones.
					register('/sw.js', {
						registrationOptions: { scope: './' },
						ready(registration) {
							//console.log('Service worker is active.');
						},
						registered(registration) {
							//console.log('Service worker has been registered.', registration);
							navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
								//console.log('serviceWorkerRegistration: ', serviceWorkerRegistration);
								serviceWorkerRegistration.pushManager
									.getSubscription()
									.then(function(subscription) {
										if (!subscription) {
											subscribe();
											return;
										}
										// Keep your server in sync with the latest subscriptionId
										// sendSubscriptionToServer(subscription);
									})
									.catch(function(err) {
										console.warn('Error during getSubscription()', err);
									});
							});
						},
						cached(registration) {
							console.log('Content has been cached for offline use.');
						},
						updatefound(registration) {
							console.log('New content is downloading.');
						},
						updated(registration) {
							console.log('New content is available; please refresh.');
						},
						offline() {
							console.log('No internet connection found. App is running in offline mode.');
						},
						error(error) {
							console.error('Error during service worker registration:', error);
						}
					});

				})
				.catch(function(err) {
					console.log('Service Worker Failed to Register', err);
				});
			})
		}
	});
};

export default useServiceWorker;
