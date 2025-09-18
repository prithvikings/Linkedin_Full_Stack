import React from 'react';
const NotificationCard = ({ notification, onDelete, currentUserImageUrl }) => {
    // Determine the action message based on the notification type
    const getActionText = (type) => {
        switch (type) {
            case 'like':
                return 'liked your post.';
            case 'comment':
                return 'commented on your post.';
            case 'connectionrequest':
                return 'sent you a connection request.';
            case 'connectionAccepted':
                return 'accepted your connection request.';
            default:
                return 'has an update for you.';
        }
    };

    // Construct the URL for the user's profile
    const profileUrl = `/profile/${notification.relatedUser?._id}`;

    // Get the timestamp for display
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    return (
        <div className="flex items-start gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
            {/* User Profile Picture */}
            <div className="flex-shrink-0">
                <img
                    src={notification.relatedUser?.picture || currentUserImageUrl} // CORRECTED to .picture
                    alt="User Profile"
                    className="w-10 h-10 rounded-full object-cover"
                />
            </div>

            {/* Notification Content */}
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-semibold text-gray-800">
                        {notification.relatedUser?.firstname} {notification.relatedUser?.lastname} 
                    </span>{" "}
                    {getActionText(notification.type)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{timeAgo(notification.createdAt)}</p>
            </div>
            
            {/* Action Buttons (e.g., Delete) */}
            <button
                onClick={() => onDelete(notification._id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

export default NotificationCard;