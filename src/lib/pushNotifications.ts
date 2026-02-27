// src/lib/pushNotifications.ts

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeUserToPush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push messaging is not supported");
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            if (!publicVapidKey) {
                throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY")
            }
            const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            // Send subscription to server
            await fetch("/api/push/subscribe", {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {
                    "content-type": "application/json"
                }
            });
            console.log("Subscribed successfully");
        }
        return subscription;
    } catch (err) {
        console.error("Error subscribing to push notifications", err);
        return null;
    }
}
