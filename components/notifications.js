// Notification Component
class NotificationComponent {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.initialize();
    }

    initialize() {
        // Load notifications from localStorage or initialize with default data
        this.loadNotifications();
        this.render();
        this.setupEventListeners();
    }

    loadNotifications() {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
            this.notifications = JSON.parse(savedNotifications);
        } else {
            // Default notifications
            this.notifications = [
                {
                    id: 1,
                    title: 'Welcome to SmartFin',
                    message: 'Start tracking your finances today!',
                    timestamp: new Date().toISOString(),
                    read: false
                },
                {
                    id: 2,
                    title: 'Tip of the Day',
                    message: 'Try categorizing your expenses for better insights.',
                    timestamp: new Date().toISOString(),
                    read: false
                }
            ];
            this.saveNotifications();
        }
        this.updateUnreadCount();
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.updateBadge();
    }

    updateBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.updateUnreadCount();
        this.render();
    }

    addNotification(title, message) {
        const newNotification = {
            id: Date.now(),
            title,
            message,
            timestamp: new Date().toISOString(),
            read: false
        };
        this.notifications.unshift(newNotification);
        this.saveNotifications();
        this.updateUnreadCount();
        this.render();
    }

    render() {
        const notificationList = document.querySelector('.notification-list');
        if (!notificationList) return;

        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <span class="notification-time">${this.formatTime(notification.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }

    setupEventListeners() {
        // Mark all as read button
        const markAllReadBtn = document.querySelector('.mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => this.markAllAsRead());
        }

        // Notification items
        document.addEventListener('click', (e) => {
            const notificationItem = e.target.closest('.notification-item');
            if (notificationItem) {
                const id = parseInt(notificationItem.dataset.id);
                this.markAsRead(id);
            }
        });
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.saveNotifications();
            this.updateUnreadCount();
            this.render();
        }
    }
}

// Initialize notification component
document.addEventListener('DOMContentLoaded', () => {
    window.notificationComponent = new NotificationComponent();
}); 