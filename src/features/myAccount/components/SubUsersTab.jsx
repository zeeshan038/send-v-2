import React from 'react';
import { Users } from 'lucide-react';

const SubUsersTab = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[16px] shadow-sm min-h-[400px]">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Manage Sub-users</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm max-w-sm text-center mb-6">
                Invite your team members and manage their access to your workspaces.
            </p>
            <button className="bg-[#293a93] dark:bg-blue-600 hover:bg-[#202c70] dark:hover:bg-blue-700 text-white px-6 py-2.5 rounded-[10px] text-[14px] font-semibold transition-colors shadow-md shadow-[#293a93]/20 dark:shadow-blue-900/20">
                Invite User
            </button>
        </div>
    );
};

export default SubUsersTab;
