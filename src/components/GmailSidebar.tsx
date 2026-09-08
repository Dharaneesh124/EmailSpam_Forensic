import React from 'react';
import {
  Inbox,
  Star,
  Send,
  FileText,
  AlertOctagon,
  Trash2,
  Activity,
  Layers,
  ShieldCheck,
  Blocks,
  Code,
  Plus,
  ShieldAlert,
  HardDrive,
  Globe,
  Lock,
} from 'lucide-react';

export type GmailNavigationTab =
  | 'inbox'
  | 'starred'
  | 'sent'
  | 'drafts'
  | 'spam'
  | 'trash'
  | 'dashboard'
  | 'analyzer'
  | 'mitigation'
  | 'blockchain'
  | 'smart_contracts';

interface GmailSidebarProps {
  isOpen: boolean;
  activeTab: GmailNavigationTab;
  onSelectTab: (tab: GmailNavigationTab) => void;
  inboxCount: number;
  spamCount: number;
  starredCount: number;
  theme: 'light' | 'dark' | 'cyber';
  onOpenIngest: () => void;
  userEmail: string;
}

export const GmailSidebar: React.FC<GmailSidebarProps> = ({
  isOpen,
  activeTab,
  onSelectTab,
  inboxCount,
  spamCount,
  starredCount,
  theme,
  onOpenIngest,
  userEmail,
}) => {
  const isLight = theme === 'light';
  const isCyber = theme === 'cyber';

  const mainMailItems = [
    {
      id: 'inbox' as const,
      label: 'Inbox',
      icon: Inbox,
      count: inboxCount,
      badgeColor: 'bg-[#0b57d0] text-white',
    },
    {
      id: 'starred' as const,
      label: 'Starred',
      icon: Star,
      count: starredCount > 0 ? starredCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'sent' as const,
      label: 'Sent',
      icon: Send,
      count: undefined,
    },
    {
      id: 'drafts' as const,
      label: 'Drafts',
      icon: FileText,
      count: undefined,
    },
    {
      id: 'spam' as const,
      label: 'Spam',
      icon: AlertOctagon,
      count: spamCount,
      badgeColor: 'bg-[#d93025] text-white font-bold',
      isSpamAlert: true,
      description: 'Threat details & location',
    },
    {
      id: 'trash' as const,
      label: 'Trash & Quarantined',
      icon: Trash2,
      count: undefined,
    },
  ];

  const forensicToolItems = [
    {
      id: 'dashboard' as const,
      label: 'Threat Dashboard',
      icon: Activity,
      badge: 'Global Map',
    },
    {
      id: 'analyzer' as const,
      label: 'Forensic Workbench',
      icon: Layers,
      badge: 'Protocols',
    },
    {
      id: 'mitigation' as const,
      label: 'SOAR Mitigation',
      icon: ShieldCheck,
      badge: 'Active',
    },
    {
      id: 'blockchain' as const,
      label: 'Threat Blockchain',
      icon: Blocks,
      badge: 'PoA Ledger',
    },
    {
      id: 'smart_contracts' as const,
      label: 'Smart Contracts',
      icon: Code,
      badge: 'v2.4',
    },
  ];

  return (
    <aside
      id="gmail-sidebar"
      className={`transition-all duration-200 shrink-0 flex flex-col justify-between select-none ${
        isOpen ? 'w-64 sm:w-68' : 'w-16 sm:w-18'
      } ${
        isLight
          ? 'bg-[#f6f8fc] border-r border-[#e5e7eb] text-[#444746]'
          : isCyber
          ? 'bg-[#0A0A0F] border-r border-[#00FF41]/20 text-[#E5E7EB]'
          : 'bg-[#181920] border-r border-[#2e2e38] text-gray-300'
      }`}
    >
      <div className="p-3 space-y-4 overflow-y-auto">
        {/* Gmail Compose / Ingest Button */}
        <div className="pt-1">
          <button
            id="sidebar-compose-button"
            onClick={onOpenIngest}
            title="Ingest new raw EML or simulate cyber threat"
            className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-md hover:shadow-lg transition-all duration-200 font-medium ${
              isOpen ? 'w-full' : 'w-12 h-12 p-0 justify-center mx-auto'
            } ${
              isLight
                ? 'bg-[#c2e7ff] text-[#001d35] hover:bg-[#b3dcf7]'
                : isCyber
                ? 'bg-[#00FF41] text-black hover:bg-[#00e63a] font-mono'
                : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
            }`}
          >
            <Plus className="h-5 w-5 shrink-0" />
            {isOpen && <span className="text-sm font-semibold">Ingest Email</span>}
          </button>
        </div>

        {/* Primary Folders List */}
        <nav className="space-y-0.5">
          {mainMailItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isSpam = item.id === 'spam';

            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-between rounded-r-full py-2.5 px-3 transition-colors ${
                  isActive
                    ? isLight
                      ? isSpam
                        ? 'bg-[#fce8e6] text-[#c5221f] font-semibold'
                        : 'bg-[#d3e3fd] text-[#041e49] font-semibold'
                      : isCyber
                      ? 'bg-[#00FF41]/20 text-[#00FF41] font-mono font-bold'
                      : 'bg-[#2a2c38] text-white font-semibold'
                    : isLight
                    ? 'hover:bg-[#eaedf2] text-[#444746]'
                    : isCyber
                    ? 'hover:bg-[#1A1A24] text-gray-300'
                    : 'hover:bg-[#20222c] text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 ${
                      isSpam
                        ? 'text-[#d93025]'
                        : isActive
                        ? isLight
                          ? 'text-[#041e49]'
                          : 'text-[#00FF41]'
                        : 'text-current'
                    }`}
                  />
                  {isOpen && (
                    <div className="flex flex-col text-left">
                      <span className="text-sm truncate">{item.label}</span>
                      {isSpam && (
                        <span className="text-[10px] text-[#d93025] font-normal leading-tight">
                          Threats & Location
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isOpen && item.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.badgeColor || (isLight ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-200')
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider: Security & Forensic Capabilities */}
        <div className="pt-2">
          {isOpen ? (
            <div className="px-3 pb-1.5 flex items-center justify-between text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <span>Forensic Engine</span>
              <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded font-mono">
                PoA Active
              </span>
            </div>
          ) : (
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
          )}

          <nav className="space-y-0.5">
            {forensicToolItems.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTab === tool.id;

              return (
                <button
                  key={tool.id}
                  id={`sidebar-tab-${tool.id}`}
                  onClick={() => onSelectTab(tool.id)}
                  title={tool.label}
                  className={`w-full flex items-center justify-between rounded-r-full py-2 px-3 transition-colors ${
                    isActive
                      ? isLight
                        ? 'bg-[#d3e3fd] text-[#041e49] font-semibold'
                        : isCyber
                        ? 'bg-[#00FF41]/20 text-[#00FF41] font-mono font-bold'
                        : 'bg-[#2a2c38] text-white font-semibold'
                      : isLight
                      ? 'hover:bg-[#eaedf2] text-[#444746]'
                      : isCyber
                      ? 'hover:bg-[#1A1A24] text-gray-300'
                      : 'hover:bg-[#20222c] text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className="h-4 w-4 shrink-0 text-current" />
                    {isOpen && <span className="text-xs truncate">{tool.label}</span>}
                  </div>
                  {isOpen && (
                    <span className="text-[10px] text-gray-400 font-mono">
                      {tool.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Mailbox Footnote */}
      {isOpen && (
        <div className="p-3 border-t border-[#e5e7eb] dark:border-[#2e2e38] text-[11px] text-gray-500 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300 truncate">
            <Lock className="h-3 w-3 text-green-600 shrink-0" />
            <span className="truncate">{userEmail}</span>
          </div>
          <div className="text-[10px] text-gray-400">
            Protected by PoA Blockchain & AI Forensics
          </div>
        </div>
      )}
    </aside>
  );
};
