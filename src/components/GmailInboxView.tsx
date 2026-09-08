import React, { useState } from 'react';
import { EmailIncident } from '../types';
import {
  ArrowLeft,
  Star,
  Trash2,
  AlertOctagon,
  Mail,
  MailOpen,
  RotateCw,
  MoreVertical,
  Reply,
  Forward,
  Paperclip,
  Download,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  Tag,
  Inbox,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface GmailInboxViewProps {
  incidents: EmailIncident[];
  selectedIncident: EmailIncident | null;
  onSelectIncident: (inc: EmailIncident | null) => void;
  onMoveToSpam: (id: string) => void;
  onInspectForensics: (inc: EmailIncident) => void;
  theme: 'light' | 'dark' | 'cyber';
  userEmail: string;
}

export const GmailInboxView: React.FC<GmailInboxViewProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onMoveToSpam,
  onInspectForensics,
  theme,
  userEmail,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'primary' | 'social' | 'updates'>('primary');
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isLight = theme === 'light';
  const isCyber = theme === 'cyber';

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === incidents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(incidents.map((i) => i.id)));
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const formatFullDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // If an email is selected, display Gmail reading view
  if (selectedIncident) {
    return (
      <div
        id="gmail-reading-pane"
        className={`rounded-2xl border shadow-xs overflow-hidden flex flex-col min-h-[600px] ${
          isLight
            ? 'bg-white border-[#e5e7eb] text-[#1f1f1f]'
            : isCyber
            ? 'bg-[#0A0A0F] border-[#00FF41]/30 text-[#E5E7EB]'
            : 'bg-[#1e1e24] border-[#2e2e38] text-white'
        }`}
      >
        {/* Top Reading Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectIncident(null)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
              title="Back to Inbox"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
            <button
              onClick={() => onMoveToSpam(selectedIncident.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
              title="Report suspicious and move to Spam"
            >
              <AlertOctagon className="h-3.5 w-3.5" />
              <span>Report as Spam</span>
            </button>
            <button
              onClick={() => onInspectForensics(selectedIncident)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
              title="Open Technical Forensic Workbench"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Inspect Technical Forensics</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="font-mono">Case: {selectedIncident.caseNumber}</span>
          </div>
        </div>

        {/* Email Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
              {selectedIncident.subject}
            </h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span>Verified Clean Delivery</span>
              </span>
            </div>
          </div>

          {/* Sender & Recipient Information */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {selectedIncident.senderDisplay.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${isLight ? 'text-black' : 'text-white'}`}>
                    {selectedIncident.senderDisplay}
                  </span>
                  <span className={`text-xs font-mono ${isLight ? 'text-gray-700' : 'text-gray-400'}`}>
                    &lt;{selectedIncident.senderAddress}&gt;
                  </span>
                </div>
                <div className={`text-xs flex items-center gap-1 ${isLight ? 'text-gray-700' : 'text-gray-400'}`}>
                  <span>to:</span>
                  <span className="font-medium text-blue-600 font-mono">
                    {userEmail}
                  </span>
                </div>
              </div>
            </div>

            <div className={`text-right text-xs ${isLight ? 'text-gray-700' : 'text-gray-400'}`}>
              <div>{formatFullDate(selectedIncident.receivedAt)}</div>
              <div className="text-[11px] text-green-600 flex items-center justify-end gap-1 mt-0.5">
                <Lock className="h-3 w-3" /> Standard TLS 1.3 Encryption
              </div>
            </div>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="px-6 py-6 flex-1 space-y-6">
          <div className={`max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans ${
            isLight ? 'text-black font-normal' : 'text-gray-200'
          }`}>
            {selectedIncident.bodyText}
          </div>

          {/* Attachments (if any) */}
          {selectedIncident.attachments && selectedIncident.attachments.length > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Attachments ({selectedIncident.attachments.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedIncident.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{att.filename}</div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {att.filesize} • {att.filetype}
                      </div>
                    </div>
                    <button
                      className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600"
                      title="Download attachment"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Email Footer Quick Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-xs font-medium transition-colors shadow-xs">
              <Reply className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-xs font-medium transition-colors shadow-xs">
              <Forward className="h-3.5 w-3.5" />
              <span>Forward</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onInspectForensics(selectedIncident)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View Security & Hop Details</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal Gmail List View
  return (
    <div
      id="gmail-inbox-view"
      className={`rounded-2xl border shadow-xs overflow-hidden flex flex-col ${
        isLight
          ? 'bg-white border-[#e5e7eb] text-[#1f1f1f]'
          : isCyber
          ? 'bg-[#0A0A0F] border-[#00FF41]/30 text-[#E5E7EB]'
          : 'bg-[#1e1e24] border-[#2e2e38] text-white'
      }`}
    >
      {/* Action Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedIds.size > 0 && selectedIds.size === incidents.length}
            onChange={toggleSelectAll}
            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
            title="Select all"
          />
          <button
            onClick={() => window.location.reload()}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
            title="Refresh"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <div className="text-xs text-gray-500 font-medium">
            Mailbox: <span className="font-mono text-blue-600 dark:text-blue-400">{userEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{incidents.length} emails</span>
        </div>
      </div>

      {/* Gmail Tabs: Primary / Social / Updates */}
      <div className="flex items-center border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveSubTab('primary')}
          className={`flex items-center gap-3 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeSubTab === 'primary'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-black/5'
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Primary</span>
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {incidents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('updates')}
          className={`flex items-center gap-3 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeSubTab === 'updates'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-black/5'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Updates</span>
        </button>
      </div>

      {/* Email List Rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {incidents.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <Mail className="h-10 w-10 mx-auto text-gray-400 stroke-1" />
            <div className="text-base font-semibold">No emails found in this category</div>
            <div className="text-xs">
              All incoming communications addressed to <span className="font-mono">{userEmail}</span> are monitored.
            </div>
          </div>
        ) : (
          incidents.map((inc) => {
            const isStarred = starredIds.has(inc.id);
            const isChecked = selectedIds.has(inc.id);

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm ${
                  isChecked
                    ? 'bg-blue-50/70 dark:bg-blue-950/30'
                    : isLight
                    ? 'hover:bg-[#f2f6fc]'
                    : isCyber
                    ? 'hover:bg-[#00FF41]/10 font-mono'
                    : 'hover:bg-[#252632]'
                }`}
              >
                {/* Row Checkbox & Star */}
                <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => toggleSelect(inc.id, e as any)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                  />
                  <button
                    onClick={(e) => toggleStar(inc.id, e)}
                    className="text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`h-4.5 w-4.5 ${
                        isStarred ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Sender Display */}
                <div
                  className={`w-44 sm:w-52 shrink-0 truncate font-semibold ${
                    isLight ? 'text-black' : isCyber ? 'text-[#00FF41]' : 'text-white'
                  }`}
                >
                  {inc.senderDisplay}
                </div>

                {/* Subject & Preview Snippet (Initial Lines of Mail) */}
                <div className="flex-1 min-w-0 flex items-center gap-2 truncate">
                  <span
                    className={`font-semibold truncate ${
                      isLight ? 'text-black' : isCyber ? 'text-white' : 'text-white'
                    }`}
                  >
                    {inc.subject}
                  </span>
                  <span className={`${isLight ? 'text-black' : 'text-gray-400'} select-none font-bold`}>-</span>
                  <span
                    className={`truncate text-xs ${
                      isLight ? 'text-black font-normal' : isCyber ? 'text-gray-300' : 'text-gray-300'
                    }`}
                  >
                    {inc.bodyText.replace(/\n/g, ' ')}
                  </span>
                </div>

                {/* Security Verification Tag */}
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300">
                    <ShieldCheck className="h-3 w-3 text-green-600" />
                    <span>SPF & DKIM Valid</span>
                  </span>
                </div>

                {/* Date / Quick Actions */}
                <div
                  className={`w-20 shrink-0 text-right text-xs group-hover:hidden ${
                    isLight ? 'text-black font-medium' : 'text-gray-400'
                  }`}
                >
                  {formatDate(inc.receivedAt)}
                </div>

                {/* Hover Actions */}
                <div
                  className="hidden group-hover:flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onMoveToSpam(inc.id)}
                    title="Mark as Spam"
                    className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-red-600"
                  >
                    <AlertOctagon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onInspectForensics(inc)}
                    title="View Technical Forensics"
                    className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-600"
                  >
                    <Layers className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
