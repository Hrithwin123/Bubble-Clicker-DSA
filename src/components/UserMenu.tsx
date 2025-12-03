import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { getUser, logout } from '../utils/authApi';

export default function UserMenu() {
    const [showMenu, setShowMenu] = useState(false);
    const user = getUser();

    const handleLogout = () => {
        logout();
        setShowMenu(false);
        window.location.reload();
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.username}</span>
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
