import React, { useState, useEffect, useContext } from 'react';
import { Auth } from "../context/AuthContext";
import { UserDataCtx } from "../context/UserContext";
import NotificationCard from "../components/NotificationCard";

const NotificationsPage = () => {
    const { serverUrl } = useContext(Auth);
    const { imageUrl } = useContext(UserDataCtx);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all notifications for the current user
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${serverUrl}/api/notifications/get`, {
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) {
                setNotifications(data.notifications); // Your backend needs to send an object with a 'notifications' key.
            } else {
                console.error("Failed to fetch notifications:", data.message);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    // Delete a single notification
    const handleDeleteNotification = async (id) => {
        try {
            const res = await fetch(`${serverUrl}/api/notifications/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                setNotifications(prev => prev.filter(n => n._id !== id));
            } else {
                console.error("Failed to delete notification.");
            }
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    // Clear all notifications
    const handleClearAllNotifications = async () => {
        try {
            const res = await fetch(`${serverUrl}/api/notifications/clear`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                setNotifications([]); // Clear the notifications state
            } else {
                console.error("Failed to clear notifications.");
            }
        } catch (err) {
            console.error("Error clearing all notifications:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                        <button
                            onClick={handleClearAllNotifications}
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No new notifications.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {notifications.map((notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                    onDelete={handleDeleteNotification}
                                    currentUserImageUrl={imageUrl}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;