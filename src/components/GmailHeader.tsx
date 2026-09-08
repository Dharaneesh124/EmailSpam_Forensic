import React, { useState } from 'react';
import {
  Menu,
  Search,
  SlidersHorizontal,
  X,
  Upload,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Blocks,
  Sun,
  Moon,
  Terminal,
  HelpCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface GmailHeaderProps {
  userEmail: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenIngest: () => void;
  maskPii: boolean;
  onToggleMaskPii: () => void;
  blockCount: number;
  theme: 'light' | 'dark' | 'cyber';
  onThemeChange: (theme: 'light' | 'dark' | 'cyber') => void;
  cleanEmailCount: number;
  spamEmailCount: number;
}

export const GmailHeader: React.FC<GmailHeaderProps> = ({
  userEmail,
  searchQuery,
  onSearchChange,
  sidebarOpen,
  onToggleSidebar,
  onOpenIngest,
  maskPii,
  onToggleMaskPii,
  blockCount,
  theme,
  onThemeChange,
  cleanEmailCount,
  spamEmailCount,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const isLight = theme === 'light';
  const isCyber = theme === 'cyber';

  return (
    <header
      id="gmail-header"
      className={`sticky top-0 z-50 border-b px-3 sm:px-4 py-2.5 transition-colors duration-200 ${
        isLight
          ? 'bg-[#ffffff] border-[#e5e7eb] text-[#1f2937] shadow-xs'
          : isCyber
          ? 'bg-[#000000] border-[#00FF41]/30 text-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
          : 'bg-[#1e1e24] border-[#2e2e38] text-[#e5e7eb] shadow-md'
      }`}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            title={sidebarOpen ? 'Collapse menu' : 'Expand menu'}
            className={`p-2 rounded-full transition-colors ${
              isLight
                ? 'hover:bg-[#f1f3f4] text-[#5f6368]'
                : isCyber
                ? 'hover:bg-[#00FF41]/20 text-[#00FF41]'
                : 'hover:bg-[#2e2e38] text-[#9ca3af]'
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            {/* Colorful Gmail-inspired envelope with Shield */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285F4] via-[#EA4335] to-[#FBBC05] p-0.5 shadow-xs">
              <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6.5A2.5 2.5 0 015.5 4h13A2.5 2.5 0 0121 6.5v11a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5v-11z"
                    stroke="#EA4335"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M3 6.5l9 6.5 9-6.5"
                    stroke="#4285F4"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 17.5l6-5m12 5l-6-5"
                    stroke="#34A853"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#34A853] text-white ring-1 ring-white">
                <ShieldCheck className="h-2 w-2" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center">
                <span
                  className={`text-lg font-bold tracking-tight ${
                    isCyber ? 'font-mono' : ''
                  }`}
                >
                  <span className="text-black font-extrabold">Evi</span>
                  <span className="text-black font-extrabold">-</span>
                  <span className="text-[#4285F4]">M</span>
                  <span className="text-[#EA4335]">a</span>
                  <span className="text-[#FBBC05]">i</span>
                  <span className="text-[#34A853]">l</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Gmail Search Bar */}
        <div className="flex-1 max-w-2xl mx-1 sm:mx-4">
          <div
            className={`relative flex items-center w-full rounded-full transition-all duration-150 ${
              isLight
                ? 'bg-[#eaf1fb] focus-within:bg-white focus-within:shadow-md focus-within:ring-1 focus-within:ring-[#c2e7ff]'
                : isCyber
                ? 'bg-[#0A0A0F] border border-[#00FF41]/40 focus-within:border-[#00FF41] focus-within:shadow-[0_0_12px_rgba(0,255,65,0.3)]'
                : 'bg-[#2a2b36] focus-within:bg-[#323442] focus-within:ring-1 focus-within:ring-blue-500'
            }`}
          >
            <div className="pl-3.5 pr-2 py-2 text-[#5f6368] flex items-center">
              <Search className="h-4 w-4" />
            </div>

            <input
              id="gmail-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search in mail, senders, or forensic indicators..."
              className={`w-full py-2 text-sm bg-transparent border-none outline-none ${
                isLight
                  ? 'text-[#1f1f1f] placeholder:text-[#747775]'
                  : isCyber
                  ? 'text-[#00FF41] placeholder:text-[#E5E7EB]/40 font-mono text-xs'
                  : 'text-white placeholder:text-gray-400'
              }`}
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 mr-1 text-[#5f6368] hover:text-[#1f1f1f] rounded-full hover:bg-black/5"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className={`p-2 mr-1 rounded-full transition-colors ${
                isLight
                  ? 'hover:bg-[#d3e3fd] text-[#5f6368]'
                  : 'hover:bg-white/10 text-gray-300'
              }`}
              title="Search filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Filter Modal Dropdown */}
          {filterMenuOpen && (
            <div
              className={`absolute mt-2 w-72 sm:w-80 rounded-xl p-3 border shadow-xl z-50 text-xs ${
                isLight
                  ? 'bg-white border-[#e5e7eb] text-[#1f2937]'
                  : 'bg-[#1e1e24] border-[#374151] text-white'
              }`}
            >
              <div className="font-semibold pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span>Quick Filter Search</span>
                <button
                  onClick={() => setFilterMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 pt-2">
                <button
                  onClick={() => {
                    onSearchChange('is:spam');
                    setFilterMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
                >
                  <span>Filter by: Spam & Threats</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-medium">
                    {spamEmailCount}
                  </span>
                </button>
                <button
                  onClick={() => {
                    onSearchChange('is:verified');
                    setFilterMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
                >
                  <span>Filter by: Verified SPF/DKIM</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded font-medium">
                    {cleanEmailCount}
                  </span>
                </button>
                <button
                  onClick={() => {
                    onSearchChange('Nigeria');
                    setFilterMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Location: Origin Nigeria (Lagos)
                </button>
                <button
                  onClick={() => {
                    onSearchChange('Romania');
                    setFilterMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Location: Origin Romania (Bucharest)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Controls, Ingest & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PoA Blockchain Telemetry Badge */}
          <div
            title={`PoA Consortium Blockchain Height: Block #${blockCount}. All evidence is cryptographically immutable.`}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              isLight
                ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
                : isCyber
                ? 'bg-[#00FF41]/10 border-[#00FF41]/40 text-[#00FF41]'
                : 'bg-[#1f2937] border-[#374151] text-green-400'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
            <Blocks className="h-3 w-3" />
            <span>Block #{blockCount}</span>
          </div>

          {/* Live Ingest Simulator Button */}
          <button
            id="header-live-ingest-btn"
            onClick={onOpenIngest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-xs bg-[#1a73e8] hover:bg-[#1557b0] text-white"
            title="Ingest raw email EML or simulate an incoming cyber attack"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Ingest Email</span>
          </button>

          {/* PII Masking Toggle */}
          <button
            id="header-mask-pii-btn"
            onClick={onToggleMaskPii}
            title={maskPii ? 'PII is masked (GDPR active)' : 'Raw PII displayed'}
            className={`p-2 rounded-full transition-colors ${
              maskPii
                ? 'bg-[#e8f0fe] text-[#1967d2]'
                : isLight
                ? 'hover:bg-[#f1f3f4] text-[#5f6368]'
                : 'hover:bg-white/10 text-gray-400'
            }`}
          >
            {maskPii ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>

          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => {
                if (theme === 'light') onThemeChange('dark');
                else if (theme === 'dark') onThemeChange('cyber');
                else onThemeChange('light');
              }}
              title={`Theme: ${theme.toUpperCase()}. Click to cycle (Light -> Dark -> Cyber).`}
              className={`p-2 rounded-full transition-colors ${
                isLight
                  ? 'hover:bg-[#f1f3f4] text-[#5f6368]'
                  : isCyber
                  ? 'bg-[#00FF41]/20 text-[#00FF41]'
                  : 'hover:bg-white/10 text-yellow-400'
              }`}
            >
              {isLight ? (
                <Sun className="h-4 w-4 text-[#ea8600]" />
              ) : isCyber ? (
                <Terminal className="h-4 w-4 text-[#00FF41]" />
              ) : (
                <Moon className="h-4 w-4 text-blue-300" />
              )}
            </button>
          </div>

          {/* User Account Avatar with mail ID: dharaneeshsk2007@gmail.com */}
          <div className="relative">
            <button
              id="user-profile-button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#34a853] text-white font-bold flex items-center justify-center text-sm shadow-xs ring-2 ring-white dark:ring-gray-800">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold leading-tight truncate max-w-32">
                  {userEmail.split('@')[0]}
                </span>
                <span className="text-[10px] text-gray-500 truncate max-w-32">
                  @{userEmail.split('@')[1]}
                </span>
              </div>
            </button>

            {/* Account Info Popover */}
            {profileOpen && (
              <div
                id="user-account-popover"
                className={`absolute right-0 mt-2 w-80 rounded-2xl p-4 border shadow-2xl z-50 transition-all ${
                  isLight
                    ? 'bg-white border-[#e5e7eb] text-[#1f2937]'
                    : 'bg-[#1e1e24] border-[#374151] text-white'
                }`}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#34a853] text-white font-bold flex items-center justify-center text-lg shadow-md">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">Dharaneesh</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                      {userEmail}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400 font-medium mt-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Mailbox Active & Protected
                    </span>
                  </div>
                </div>

                <div className="py-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-500">Inbox Clean Mails:</span>
                    <span className="font-semibold text-green-600">{cleanEmailCount} Verified</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-500">Spam Interceptions:</span>
                    <span className="font-semibold text-red-600">{spamEmailCount} Quarantined</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <span className="text-gray-500">Blockchain Seal:</span>
                    <span className="font-mono font-semibold">PoA Height #{blockCount}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-500">Google AI Studio Engine</span>
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-xs font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
