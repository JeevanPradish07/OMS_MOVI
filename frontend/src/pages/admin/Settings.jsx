import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal, Shield, Bell, Palette, Database, Globe, Server, AlertTriangle, CheckCircle,
  EyeOff, ShieldCheck, Mail, ImagePlus, Download, Plus, Key, RefreshCw
} from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

// --- SUB-COMPONENTS ---
const Toast = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 right-4 z-[100] bg-[#16A34A] text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg"
      >
        <CheckCircle size={18} />
        <span className="text-sm font-medium">Settings saved successfully</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const TabNav = ({ tabs, activeTab, setActiveTab, dirtyState }) => (
  <div className="w-64 min-w-[256px] bg-[#F8FAFC] border-r border-[#E2E8F0] p-3 flex flex-col">
    <div className="text-xs font-semibold text-[#94A3B8] tracking-widest px-3 py-2 mb-2">
      CONFIGURATION
    </div>
    <div className="flex-1 space-y-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        // Mock dirty check for specific tabs. Here we just show it if any global state is dirty for simplicity, 
        // but normally you'd check per-tab dirty state. For now, show on general if dirty to simulate.
        const hasUnsavedChanges = dirtyState && tab.id === 'general'; 
        
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
              isActive
                ? 'bg-[#EFF6FF] text-[#2563EB] font-medium'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
          >
            <Icon size={16} />
            <span className="flex-1 text-left">{tab.label}</span>
            {hasUnsavedChanges && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></div>
            )}
          </button>
        );
      })}
    </div>
    <div className="border-t border-[#E2E8F0] my-4 mx-3"></div>
    <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-3 mx-2 mt-auto flex items-start gap-2">
      <AlertTriangle size={14} className="text-[#D97706] shrink-0 mt-0.5" />
      <p className="text-xs text-[#92400E] leading-relaxed">
        Changes to Security and System settings take effect immediately and may affect all users.
      </p>
    </div>
  </div>
);

const SettingsSection = ({ title, description, children, isDanger = false }) => (
  <div className={`mb-8 ${isDanger ? 'border border-[#DC2626] rounded-xl p-6 bg-[#FEF2F2]/30' : ''}`}>
    <h3 className={`text-base font-semibold mb-1 ${isDanger ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>{title}</h3>
    {description && <p className="text-sm text-[#64748B] mb-5">{description}</p>}
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const FieldGroup = ({ label, helper, warning, children }) => (
  <div>
    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{label}</label>
    {children}
    {helper && <p className="text-xs text-[#64748B] mt-1.5">{helper}</p>}
    {warning && (
      <div className="mt-2 bg-[#FEF3C7] border border-[#FDE68A] rounded p-2 text-xs text-[#92400E]">
        {warning}
      </div>
    )}
  </div>
);

const ToggleSwitch = ({ label, description, checked, onChange, isDanger = false }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm font-medium text-[#0F172A]">{label}</div>
      {description && <div className="text-xs text-[#64748B] mt-0.5">{description}</div>}
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${checked ? (isDanger ? 'bg-[#DC2626]' : 'bg-[#2563EB]') : 'bg-[#CBD5E1]'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-2' : '-translate-x-2'}`} />
    </button>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState("Today at 2:34 PM");
  const [showToast, setShowToast] = useState(false);
  
  const [settings, setSettings] = useState({
    // General
    appName: "Office Workspace Management System",
    appShortName: "OWMS",
    appUrl: "https://owms.movicloudlabs.com",
    orgName: "Movi Cloud Labs",
    orgDomain: "movicloudlabs.com",
    timezone: "(GMT+05:30) Chennai, Mumbai, New Delhi",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24-hour",
    language: "English (US)",
    currency: "INR",
    itemsPerPage: 25,
    defaultDashboard: "Overview",
    sidebarDefault: "Expanded",
    // Security
    minPasswordLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    passwordExpiry: false,
    passwordExpiryDays: 90,
    passwordHistory: true,
    passwordHistoryCount: 5,
    sessionTimeout: "1 hour",
    maxConcurrentSessions: 3,
    rememberMe: true,
    rememberMeDays: 30,
    twoFactorPolicy: "Optional",
    twoFactorMethods: { totp: true, email: true, sms: false },
    maxFailedLogins: 5,
    lockoutDuration: "15 min",
    ipAllowlist: false,
    ipAllowlistRanges: "192.168.1.0/24\n10.0.0.0/8",
    // Notifications
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "admin",
    smtpPass: "password",
    smtpEncryption: "TLS",
    fromEmail: "noreply@movicloudlabs.com",
    fromName: "OWMS Notifications",
    notifyNewUser: true,
    notifyDeactivated: true,
    notifyFailedLogin: true,
    notifyPermissionChange: true,
    notifyReportGenerated: false,
    notifySystemErrors: true,
    notifyAuditExport: false,
    notifyNewDept: false,
    dailyDigest: false,
    dailyDigestTime: "08:00 AM",
    weeklySummary: false,
    weeklySummaryDay: "Monday",
    // Branding
    primaryColor: "#2563EB",
    accentColor: "#0F172A",
    loginTitle: "Welcome to OWMS",
    loginSubtitle: "Office Workspace Management System",
    showLogoOnLogin: true,
    loginBgStyle: "Solid Color",
    // Data
    activityLogsRetention: "1 year",
    auditLogsRetention: "2 years",
    reportFilesRetention: "90 days",
    deletedRecords: "Keep for 30 days",
    autoBackup: false,
    backupFrequency: "Daily",
    backupTime: "02:00 AM",
    backupRetention: 7,
    // System
    maintenanceMode: false,
    maintenanceMessage: "System is currently under maintenance. Please check back in a few minutes.",
    apiEnabled: true,
    apiRateLimit: 100,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    setIsDirty(false);
    const now = new Date();
    setLastSaved(`Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SlidersHorizontal },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'system', label: 'System', icon: Server },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <Toast show={showToast} />
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-[#E2E8F0] bg-white flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A]">Settings</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Configure global application parameters, security policies, and system behavior.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <CheckCircle size={16} />
            Last saved: {lastSaved}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex-1 overflow-hidden p-8">
          <div className="bg-white rounded-xl border border-[#E2E8F0] h-full flex overflow-hidden shadow-sm">
            
            {/* LEFT TAB NAV */}
            <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} dirtyState={isDirty} />

            {/* RIGHT CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-3xl pb-24"
                >
                  
                  {/* TAB 1: GENERAL */}
                  {activeTab === 'general' && (
                    <>
                      <SettingsSection title="Application Identity" description="Basic information identifying this application instance.">
                        <FieldGroup label="Application Name">
                          <input type="text" value={settings.appName} onChange={e => updateSetting('appName', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                        </FieldGroup>
                        <FieldGroup label="Application Short Name / Acronym" helper="Used in browser tabs and compact UI areas">
                          <input type="text" value={settings.appShortName} onChange={e => updateSetting('appShortName', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                        </FieldGroup>
                        <FieldGroup label="Application URL">
                          <input type="url" value={settings.appUrl} onChange={e => updateSetting('appUrl', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                        </FieldGroup>
                        <div className="grid grid-cols-2 gap-6">
                          <FieldGroup label="Organization Name">
                            <input type="text" value={settings.orgName} onChange={e => updateSetting('orgName', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                          </FieldGroup>
                          <FieldGroup label="Organization Domain" helper="Used for email validation during user onboarding">
                            <input type="text" value={settings.orgDomain} onChange={e => updateSetting('orgDomain', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                          </FieldGroup>
                        </div>
                      </SettingsSection>
                      
                      <div className="border-t border-[#E2E8F0] my-8"></div>
                      
                      <SettingsSection title="Localization">
                        <FieldGroup label="Timezone">
                          <select value={settings.timezone} onChange={e => updateSetting('timezone', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                            <option value="(GMT+05:30) Chennai, Mumbai, New Delhi">(GMT+05:30) Chennai, Mumbai, New Delhi</option>
                            <option value="(GMT+00:00) London">(GMT+00:00) London</option>
                            <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                            <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</option>
                          </select>
                        </FieldGroup>
                        <div className="grid grid-cols-2 gap-6">
                          <FieldGroup label="Date Format">
                            <select value={settings.dateFormat} onChange={e => updateSetting('dateFormat', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                              <option value="DD MMM YYYY">DD MMM YYYY</option>
                            </select>
                          </FieldGroup>
                          <FieldGroup label="Time Format">
                            <div className="flex border border-[#E2E8F0] rounded-lg overflow-hidden w-full h-[38px]">
                              {['12-hour (AM/PM)', '24-hour'].map(fmt => (
                                <button key={fmt} onClick={() => updateSetting('timeFormat', fmt)} className={`flex-1 text-sm transition-colors ${settings.timeFormat === fmt ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'bg-white text-[#64748B] hover:bg-[#F8FAFC]'}`}>
                                  {fmt}
                                </button>
                              ))}
                            </div>
                          </FieldGroup>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <FieldGroup label="Language">
                            <select value={settings.language} onChange={e => updateSetting('language', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                              <option value="English (US)">English (US)</option>
                              <option value="English (UK)">English (UK)</option>
                              <option value="Spanish">Spanish</option>
                              <option value="French">French</option>
                              <option value="German">German</option>
                              <option value="Japanese">Japanese</option>
                            </select>
                          </FieldGroup>
                          <FieldGroup label="Currency" helper="Used in financial reports and budget fields">
                            <select value={settings.currency} onChange={e => updateSetting('currency', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                              <option value="INR">INR</option>
                              <option value="JPY">JPY</option>
                            </select>
                          </FieldGroup>
                        </div>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="Display Preferences">
                        <FieldGroup label="Items per page (default table pagination)">
                          <select value={settings.itemsPerPage} onChange={e => updateSetting('itemsPerPage', Number(e.target.value))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </FieldGroup>
                        <FieldGroup label="Default Dashboard View">
                          <select value={settings.defaultDashboard} onChange={e => updateSetting('defaultDashboard', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                            <option value="Overview">Overview</option>
                            <option value="Analytics">Analytics</option>
                            <option value="Activity Feed">Activity Feed</option>
                          </select>
                        </FieldGroup>
                        <FieldGroup label="Sidebar default state">
                          <div className="flex border border-[#E2E8F0] rounded-lg overflow-hidden w-full h-[38px]">
                            {['Expanded', 'Collapsed'].map(st => (
                              <button key={st} onClick={() => updateSetting('sidebarDefault', st)} className={`flex-1 text-sm transition-colors ${settings.sidebarDefault === st ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'bg-white text-[#64748B] hover:bg-[#F8FAFC]'}`}>
                                {st}
                              </button>
                            ))}
                          </div>
                        </FieldGroup>
                      </SettingsSection>
                    </>
                  )}

                  {/* TAB 2: SECURITY */}
                  {activeTab === 'security' && (
                    <>
                      <SettingsSection title="Password Policy" description="Define requirements for all user passwords in the system">
                        <FieldGroup label="Minimum Password Length" helper="Recommended: 12 or more characters">
                          <input type="number" min="6" max="32" value={settings.minPasswordLength} onChange={e => updateSetting('minPasswordLength', e.target.value)} className="w-32 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                        </FieldGroup>
                        <FieldGroup label="Password Complexity Requirements">
                          <div className="space-y-3 mt-2 border border-[#E2E8F0] rounded-lg p-4 bg-[#F8FAFC]">
                            <ToggleSwitch label="Require uppercase letters" checked={settings.requireUppercase} onChange={v => updateSetting('requireUppercase', v)} />
                            <ToggleSwitch label="Require lowercase letters" checked={settings.requireLowercase} onChange={v => updateSetting('requireLowercase', v)} />
                            <ToggleSwitch label="Require numbers" checked={settings.requireNumbers} onChange={v => updateSetting('requireNumbers', v)} />
                            <ToggleSwitch label="Require special characters" checked={settings.requireSpecial} onChange={v => updateSetting('requireSpecial', v)} />
                          </div>
                        </FieldGroup>
                        
                        <div className="space-y-4">
                          <ToggleSwitch label="Enable password expiry" checked={settings.passwordExpiry} onChange={v => updateSetting('passwordExpiry', v)} />
                          {settings.passwordExpiry && (
                            <div className="pl-4 border-l-2 border-[#E2E8F0] ml-2">
                              <FieldGroup label="Expire after (days)">
                                <input type="number" value={settings.passwordExpiryDays} onChange={e => updateSetting('passwordExpiryDays', e.target.value)} className="w-32 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                              </FieldGroup>
                            </div>
                          )}
                          <ToggleSwitch label="Prevent reuse of previous passwords" checked={settings.passwordHistory} onChange={v => updateSetting('passwordHistory', v)} />
                          {settings.passwordHistory && (
                            <div className="pl-4 border-l-2 border-[#E2E8F0] ml-2">
                              <FieldGroup label="Cannot reuse last (passwords)">
                                <input type="number" value={settings.passwordHistoryCount} onChange={e => updateSetting('passwordHistoryCount', e.target.value)} className="w-32 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                              </FieldGroup>
                            </div>
                          )}
                        </div>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="Session Management">
                        <FieldGroup label="Session Timeout" helper="Users are automatically logged out after this period of inactivity" warning={settings.sessionTimeout === "Never" ? "Setting session timeout to Never is not recommended for security" : null}>
                          <select value={settings.sessionTimeout} onChange={e => updateSetting('sessionTimeout', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                            {['15 min', '30 min', '1 hour', '2 hours', '4 hours', '8 hours', 'Never'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </FieldGroup>
                        <FieldGroup label="Maximum Concurrent Sessions" helper="Maximum number of devices a user can be logged in from simultaneously">
                          <input type="number" value={settings.maxConcurrentSessions} onChange={e => updateSetting('maxConcurrentSessions', e.target.value)} className="w-32 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                        </FieldGroup>
                        <div className="space-y-4">
                          <ToggleSwitch label="Allow users to stay logged in across browser sessions" description="Remember Me" checked={settings.rememberMe} onChange={v => updateSetting('rememberMe', v)} />
                          {settings.rememberMe && (
                            <div className="pl-4 border-l-2 border-[#E2E8F0] ml-2">
                              <FieldGroup label="Remember me duration (days)">
                                <input type="number" value={settings.rememberMeDays} onChange={e => updateSetting('rememberMeDays', e.target.value)} className="w-32 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                              </FieldGroup>
                            </div>
                          )}
                        </div>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="Two-Factor Authentication">
                        <FieldGroup label="2FA Policy">
                          <div className="space-y-3 mt-2">
                            <div onClick={() => updateSetting('twoFactorPolicy', 'Disabled')} className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${settings.twoFactorPolicy === 'Disabled' ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white'}`}>
                              <EyeOff className={settings.twoFactorPolicy === 'Disabled' ? 'text-[#2563EB]' : 'text-[#64748B]'} size={20} />
                              <div>
                                <h4 className={`text-sm font-medium ${settings.twoFactorPolicy === 'Disabled' ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>Disabled</h4>
                                <p className="text-xs text-[#64748B] mt-0.5">No 2FA required</p>
                              </div>
                            </div>
                            <div onClick={() => updateSetting('twoFactorPolicy', 'Optional')} className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${settings.twoFactorPolicy === 'Optional' ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white'}`}>
                              <Shield className={settings.twoFactorPolicy === 'Optional' ? 'text-[#2563EB]' : 'text-[#64748B]'} size={20} />
                              <div>
                                <h4 className={`text-sm font-medium ${settings.twoFactorPolicy === 'Optional' ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>Optional</h4>
                                <p className="text-xs text-[#64748B] mt-0.5">Users can choose to enable 2FA</p>
                              </div>
                            </div>
                            <div onClick={() => updateSetting('twoFactorPolicy', 'Required')} className={`border rounded-lg p-4 cursor-pointer flex items-center gap-3 transition-colors ${settings.twoFactorPolicy === 'Required' ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#E2E8F0] bg-white'}`}>
                              <ShieldCheck className={settings.twoFactorPolicy === 'Required' ? 'text-[#DC2626]' : 'text-[#64748B]'} size={20} />
                              <div>
                                <h4 className={`text-sm font-medium ${settings.twoFactorPolicy === 'Required' ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>Required</h4>
                                <p className="text-xs text-[#64748B] mt-0.5">All users must set up 2FA to access the system</p>
                              </div>
                            </div>
                            {settings.twoFactorPolicy === 'Required' && (
                              <p className="text-xs text-[#DC2626] mt-2 font-medium">Warning: Enabling required 2FA will force all users to set up 2FA on their next login.</p>
                            )}
                          </div>
                        </FieldGroup>
                        <FieldGroup label="Allowed 2FA Methods">
                          <div className="space-y-2 mt-2">
                            <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                              <input type="checkbox" checked={settings.twoFactorMethods.totp} onChange={e => updateSetting('twoFactorMethods', {...settings.twoFactorMethods, totp: e.target.checked})} className="w-4 h-4 text-[#2563EB] border-[#CBD5E1] rounded focus:ring-[#2563EB]" />
                              Authenticator App (TOTP)
                            </label>
                            <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                              <input type="checkbox" checked={settings.twoFactorMethods.email} onChange={e => updateSetting('twoFactorMethods', {...settings.twoFactorMethods, email: e.target.checked})} className="w-4 h-4 text-[#2563EB] border-[#CBD5E1] rounded focus:ring-[#2563EB]" />
                              Email OTP
                            </label>
                            <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer">
                              <input type="checkbox" checked={settings.twoFactorMethods.sms} onChange={e => updateSetting('twoFactorMethods', {...settings.twoFactorMethods, sms: e.target.checked})} className="w-4 h-4 text-[#2563EB] border-[#CBD5E1] rounded focus:ring-[#2563EB]" />
                              SMS OTP
                            </label>
                          </div>
                        </FieldGroup>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="Login & Access">
                        <div className="grid grid-cols-2 gap-6">
                          <FieldGroup label="Maximum Failed Login Attempts" helper="Account will be locked after this many consecutive failed attempts">
                            <input type="number" value={settings.maxFailedLogins} onChange={e => updateSetting('maxFailedLogins', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                          </FieldGroup>
                          <FieldGroup label="Account Lockout Duration">
                            <select value={settings.lockoutDuration} onChange={e => updateSetting('lockoutDuration', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                              {['5 min', '15 min', '30 min', '1 hour', 'Until admin unlocks'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </FieldGroup>
                        </div>
                        <div className="mt-4 space-y-4">
                          <ToggleSwitch label="Restrict access to specific IP ranges" description="IP Allowlist" checked={settings.ipAllowlist} onChange={v => updateSetting('ipAllowlist', v)} />
                          {settings.ipAllowlist && (
                            <div className="pl-4 border-l-2 border-[#E2E8F0] ml-2">
                              <FieldGroup label="IP Ranges (one per line)">
                                <textarea rows={3} value={settings.ipAllowlistRanges} onChange={e => updateSetting('ipAllowlistRanges', e.target.value)} placeholder="192.168.1.0/24&#10;10.0.0.0/8" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB] font-mono"></textarea>
                              </FieldGroup>
                            </div>
                          )}
                        </div>
                      </SettingsSection>
                    </>
                  )}

                  {/* TAB 3: NOTIFICATIONS */}
                  {activeTab === 'notifications' && (
                    <>
                      <SettingsSection title="Email Notifications">
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 mb-6">
                          <h4 className="text-sm font-medium text-[#0F172A] mb-4">SMTP Configuration</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <FieldGroup label="SMTP Host">
                              <input type="text" placeholder="smtp.gmail.com" value={settings.smtpHost} onChange={e => updateSetting('smtpHost', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                            </FieldGroup>
                            <FieldGroup label="SMTP Port">
                              <input type="number" value={settings.smtpPort} onChange={e => updateSetting('smtpPort', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                            </FieldGroup>
                            <FieldGroup label="SMTP Username">
                              <input type="text" value={settings.smtpUser} onChange={e => updateSetting('smtpUser', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                            </FieldGroup>
                            <FieldGroup label="SMTP Password">
                              <input type="password" value={settings.smtpPass} onChange={e => updateSetting('smtpPass', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                            </FieldGroup>
                            <FieldGroup label="Encryption">
                              <select value={settings.smtpEncryption} onChange={e => updateSetting('smtpEncryption', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                                <option value="None">None</option>
                                <option value="TLS">TLS</option>
                                <option value="SSL">SSL</option>
                              </select>
                            </FieldGroup>
                          </div>
                          <button className="flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:text-blue-700 transition-colors">
                            <Mail size={16} /> Send Test Email
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FieldGroup label="From Email">
                            <input type="email" value={settings.fromEmail} onChange={e => updateSetting('fromEmail', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                          </FieldGroup>
                          <FieldGroup label="From Name">
                            <input type="text" value={settings.fromName} onChange={e => updateSetting('fromName', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                          </FieldGroup>
                        </div>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="System Event Notifications" description="Choose which events trigger email notifications to admins">
                        <div className="space-y-4">
                          <ToggleSwitch label="New User Created" description="When a new user account is added" checked={settings.notifyNewUser} onChange={v => updateSetting('notifyNewUser', v)} />
                          <ToggleSwitch label="User Deactivated" description="When a user account is disabled" checked={settings.notifyDeactivated} onChange={v => updateSetting('notifyDeactivated', v)} />
                          <ToggleSwitch label="Failed Login Attempts" description="When an account has multiple failed logins" checked={settings.notifyFailedLogin} onChange={v => updateSetting('notifyFailedLogin', v)} />
                          <ToggleSwitch label="Permission Changes" description="When role permissions are modified" checked={settings.notifyPermissionChange} onChange={v => updateSetting('notifyPermissionChange', v)} />
                          <ToggleSwitch label="Report Generated" description="When a scheduled report completes" checked={settings.notifyReportGenerated} onChange={v => updateSetting('notifyReportGenerated', v)} />
                          <ToggleSwitch label="System Errors" description="When critical system errors occur" checked={settings.notifySystemErrors} onChange={v => updateSetting('notifySystemErrors', v)} />
                          <ToggleSwitch label="Audit Log Exports" description="When audit logs are exported" checked={settings.notifyAuditExport} onChange={v => updateSetting('notifyAuditExport', v)} />
                          <ToggleSwitch label="New Department Created" description="When a department is added" checked={settings.notifyNewDept} onChange={v => updateSetting('notifyNewDept', v)} />
                        </div>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="Notification Digest">
                        <div className="space-y-6">
                          <div>
                            <ToggleSwitch label="Daily Digest" description="Send daily summary email to admins" checked={settings.dailyDigest} onChange={v => updateSetting('dailyDigest', v)} />
                            {settings.dailyDigest && (
                              <div className="mt-3 pl-4 border-l-2 border-[#E2E8F0] ml-2">
                                <FieldGroup label="Send at">
                                  <input type="time" value={settings.dailyDigestTime} onChange={e => updateSetting('dailyDigestTime', e.target.value)} className="w-32 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                                </FieldGroup>
                              </div>
                            )}
                          </div>
                          <div>
                            <ToggleSwitch label="Weekly Summary" description="Send weekly activity report" checked={settings.weeklySummary} onChange={v => updateSetting('weeklySummary', v)} />
                            {settings.weeklySummary && (
                              <div className="mt-3 pl-4 border-l-2 border-[#E2E8F0] ml-2">
                                <FieldGroup label="Send on">
                                  <select value={settings.weeklySummaryDay} onChange={e => updateSetting('weeklySummaryDay', e.target.value)} className="w-32 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                                </FieldGroup>
                              </div>
                            )}
                          </div>
                        </div>
                      </SettingsSection>
                    </>
                  )}

                  {/* TAB 4: BRANDING */}
                  {activeTab === 'branding' && (
                    <>
                      <SettingsSection title="Visual Identity">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                          <FieldGroup label="Application Logo">
                            <div className="border border-dashed border-[#E2E8F0] rounded-xl p-8 text-center flex flex-col items-center justify-center bg-[#F8FAFC]">
                              <ImagePlus className="text-[#94A3B8] mb-3" size={32} />
                              <span className="text-sm font-medium text-[#0F172A] mb-1">Upload Logo</span>
                              <span className="text-xs text-[#64748B] mb-4">SVG, PNG or JPG · Max 2MB · Recommended 200×50px</span>
                              <button className="text-sm font-medium text-[#2563EB] hover:text-blue-700 transition-colors">Browse Files</button>
                            </div>
                          </FieldGroup>
                          <FieldGroup label="Favicon">
                            <div className="border border-dashed border-[#E2E8F0] rounded-xl p-8 text-center flex flex-col items-center justify-center bg-[#F8FAFC] h-full">
                              <ImagePlus className="text-[#94A3B8] mb-3" size={24} />
                              <span className="text-xs text-[#64748B] mb-4">ICO, PNG · 32×32px or 64×64px</span>
                              <button className="text-sm font-medium text-[#2563EB] hover:text-blue-700 transition-colors">Browse Files</button>
                            </div>
                          </FieldGroup>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <FieldGroup label="Application Color (Primary)" helper="Used for primary buttons, active states, and links">
                            <div className="flex items-center gap-3">
                              <input type="color" value={settings.primaryColor} onChange={e => updateSetting('primaryColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                              <input type="text" value={settings.primaryColor} onChange={e => updateSetting('primaryColor', e.target.value)} className="w-28 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                              <button style={{ backgroundColor: settings.primaryColor }} className="text-white text-xs px-3 py-2 rounded font-medium ml-2">Preview</button>
                            </div>
                          </FieldGroup>
                          <FieldGroup label="Accent Color">
                            <div className="flex items-center gap-3">
                              <input type="color" value={settings.accentColor} onChange={e => updateSetting('accentColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                              <input type="text" value={settings.accentColor} onChange={e => updateSetting('accentColor', e.target.value)} className="w-28 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                            </div>
                          </FieldGroup>
                        </div>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="Login Page">
                        <FieldGroup label="Login Page Title">
                          <input type="text" value={settings.loginTitle} onChange={e => updateSetting('loginTitle', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                        </FieldGroup>
                        <FieldGroup label="Login Page Subtitle">
                          <input type="text" value={settings.loginSubtitle} onChange={e => updateSetting('loginSubtitle', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                        </FieldGroup>
                        <div className="mt-6 mb-6">
                          <ToggleSwitch label="Show Organization Logo on Login" checked={settings.showLogoOnLogin} onChange={v => updateSetting('showLogoOnLogin', v)} />
                        </div>
                        <FieldGroup label="Login Background Style">
                          <div className="grid grid-cols-3 gap-4">
                            {['Solid Color', 'Gradient', 'Image'].map(style => (
                              <div key={style} onClick={() => updateSetting('loginBgStyle', style)} className={`border rounded-lg p-3 text-center cursor-pointer transition-colors text-sm font-medium ${settings.loginBgStyle === style ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'}`}>
                                {style}
                              </div>
                            ))}
                          </div>
                        </FieldGroup>
                      </SettingsSection>
                    </>
                  )}

                  {/* TAB 5: DATA & STORAGE */}
                  {activeTab === 'data' && (
                    <>
                      <SettingsSection title="Data Retention">
                        <FieldGroup label="User Activity Logs" helper="How long to keep user activity records">
                          <select value={settings.activityLogsRetention} onChange={e => updateSetting('activityLogsRetention', e.target.value)} className="w-full sm:w-1/2 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                            {['30 days', '90 days', '6 months', '1 year', '2 years', 'Forever'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </FieldGroup>
                        <FieldGroup label="Audit Logs Retention" warning="Reducing audit log retention may affect compliance reporting">
                          <select value={settings.auditLogsRetention} onChange={e => updateSetting('auditLogsRetention', e.target.value)} className="w-full sm:w-1/2 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                            {['30 days', '90 days', '6 months', '1 year', '2 years', 'Forever'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </FieldGroup>
                        <FieldGroup label="Report Files Retention" helper="How long to keep generated report files">
                          <select value={settings.reportFilesRetention} onChange={e => updateSetting('reportFilesRetention', e.target.value)} className="w-full sm:w-1/2 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                            {['7 days', '30 days', '90 days', '1 year', 'Forever'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </FieldGroup>
                        <FieldGroup label="Deleted Records" helper="What happens to records when deleted by admins">
                          <select value={settings.deletedRecords} onChange={e => updateSetting('deletedRecords', e.target.value)} className="w-full sm:w-1/2 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                            {['Permanently delete', 'Keep for 30 days', 'Keep for 90 days', 'Keep forever'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </FieldGroup>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="Export & Backup">
                        <div className="space-y-6">
                          <div>
                            <ToggleSwitch label="Enable automatic database backups" description="Auto Backup" checked={settings.autoBackup} onChange={v => updateSetting('autoBackup', v)} />
                            {settings.autoBackup && (
                              <div className="mt-4 pl-4 border-l-2 border-[#E2E8F0] ml-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FieldGroup label="Frequency">
                                  <select value={settings.backupFrequency} onChange={e => updateSetting('backupFrequency', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]">
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                  </select>
                                </FieldGroup>
                                <FieldGroup label="Backup Time">
                                  <input type="time" value={settings.backupTime} onChange={e => updateSetting('backupTime', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                                </FieldGroup>
                                <FieldGroup label="Retention (Backups)">
                                  <input type="number" value={settings.backupRetention} onChange={e => updateSetting('backupRetention', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                                </FieldGroup>
                              </div>
                            )}
                          </div>
                          
                          <FieldGroup label="Data Export Format">
                            <div className="flex items-center gap-6 mt-2">
                              <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-[#2563EB] border-[#CBD5E1] rounded" /> JSON</label>
                              <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer"><input type="checkbox" defaultChecked className="w-4 h-4 text-[#2563EB] border-[#CBD5E1] rounded" /> CSV</label>
                              <label className="flex items-center gap-2 text-sm text-[#0F172A] cursor-pointer"><input type="checkbox" className="w-4 h-4 text-[#2563EB] border-[#CBD5E1] rounded" /> SQL Dump</label>
                            </div>
                          </FieldGroup>

                          <div className="pt-2">
                            <button className="flex items-center gap-2 px-4 py-2 border border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg text-sm font-medium transition-colors">
                              <Download size={16} /> Export All Data
                            </button>
                            <p className="text-xs text-[#64748B] mt-2">Exports all system data. This may take several minutes for large datasets.</p>
                          </div>
                        </div>
                      </SettingsSection>
                    </>
                  )}

                  {/* TAB 6: INTEGRATIONS */}
                  {activeTab === 'integrations' && (
                    <>
                      <SettingsSection title="Connected Services" description="Manage third-party integrations and API connections">
                        <div className="space-y-4">
                          {[
                            { name: 'Slack', desc: 'Send notifications to Slack channels', connected: false, color: 'bg-purple-100' },
                            { name: 'Microsoft Teams', desc: 'Integrate with Teams for alerts', connected: false, color: 'bg-indigo-100' },
                            { name: 'Google Workspace', desc: 'Sync users with Google Directory', connected: false, color: 'bg-blue-100' },
                            { name: 'JIRA', desc: 'Link projects and tasks with JIRA', connected: false, color: 'bg-sky-100' },
                            { name: 'GitHub', desc: 'Connect repositories to projects', connected: false, color: 'bg-gray-200' },
                            { name: 'Zapier', desc: 'Automate workflows with 5000+ apps', connected: false, color: 'bg-orange-100' }
                          ].map(service => (
                            <div key={service.name} className="border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-lg text-[#0F172A] opacity-70 ${service.color}`}>
                                  {service.name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-[#0F172A]">{service.name}</h4>
                                  <p className="text-xs text-[#64748B]">{service.desc}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${service.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {service.connected ? 'Connected' : 'Not Connected'}
                                </span>
                                <button className="text-sm font-medium text-[#2563EB] hover:text-blue-700">Configure</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="API Access">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${settings.apiEnabled ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`}></div>
                                <span className="text-sm font-medium text-[#0F172A]">{settings.apiEnabled ? 'API Active' : 'API Disabled'}</span>
                              </div>
                              <p className="text-xs text-[#64748B]">Allow external applications to connect via REST API</p>
                            </div>
                            <ToggleSwitch checked={settings.apiEnabled} onChange={v => updateSetting('apiEnabled', v)} />
                          </div>
                          
                          <FieldGroup label="API Rate Limiting">
                            <div className="flex items-center gap-2">
                              <input type="number" value={settings.apiRateLimit} onChange={e => updateSetting('apiRateLimit', e.target.value)} className="w-32 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563EB]" />
                              <span className="text-sm text-[#64748B]">Requests per minute</span>
                            </div>
                          </FieldGroup>

                          <div className="flex items-center gap-4 pt-2">
                            <button className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg text-sm font-medium transition-colors">
                              <Key size={16} className="text-[#64748B]" /> View API Keys
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                              <Plus size={16} /> Generate New API Key
                            </button>
                          </div>
                        </div>
                      </SettingsSection>
                    </>
                  )}

                  {/* TAB 7: SYSTEM */}
                  {activeTab === 'system' && (
                    <>
                      <SettingsSection title="System Information">
                        <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4">
                          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                              <span className="text-sm text-[#64748B]">OWMS Version:</span>
                              <span className="text-sm font-medium text-[#0F172A]">v2.4.1</span>
                            </div>
                            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                              <span className="text-sm text-[#64748B]">Build Number:</span>
                              <span className="text-sm font-medium text-[#0F172A] font-mono">#20241012-a3f9</span>
                            </div>
                            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                              <span className="text-sm text-[#64748B]">Environment:</span>
                              <span className="text-sm font-medium text-[#16A34A]">Production</span>
                            </div>
                            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                              <span className="text-sm text-[#64748B]">Node.js Version:</span>
                              <span className="text-sm font-medium text-[#0F172A]">v20.11.0</span>
                            </div>
                            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                              <span className="text-sm text-[#64748B]">Database:</span>
                              <span className="text-sm font-medium text-[#0F172A]">PostgreSQL 15.4</span>
                            </div>
                            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                              <span className="text-sm text-[#64748B]">Last Deployed:</span>
                              <span className="text-sm font-medium text-[#0F172A]">Oct 12, 2024 at 08:00 AM</span>
                            </div>
                            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                              <span className="text-sm text-[#64748B]">Server Region:</span>
                              <span className="text-sm font-medium text-[#0F172A]">Asia South (Mumbai)</span>
                            </div>
                            <div className="flex justify-between border-b border-[#E2E8F0] pb-2">
                              <span className="text-sm text-[#64748B]">Uptime:</span>
                              <span className="text-sm font-medium text-[#0F172A]">14 days, 6 hours</span>
                            </div>
                          </div>
                        </div>
                      </SettingsSection>

                      <div className="border-t border-[#E2E8F0] my-8"></div>

                      <SettingsSection title="Maintenance">
                        <div className="space-y-6">
                          <div>
                            <ToggleSwitch label="Maintenance Mode" description="Use this when performing system updates or migrations" checked={settings.maintenanceMode} onChange={v => updateSetting('maintenanceMode', v)} isDanger={true} />
                            {settings.maintenanceMode && (
                              <div className="mt-4 bg-[#FEE2E2] border border-[#DC2626] rounded-lg p-4">
                                <p className="text-sm font-medium text-[#DC2626] mb-3">⚠ Maintenance mode is ACTIVE. All non-admin users are locked out.</p>
                                <FieldGroup label="Maintenance Message (shown to locked-out users)">
                                  <textarea rows={2} value={settings.maintenanceMessage} onChange={e => updateSetting('maintenanceMessage', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#DC2626]"></textarea>
                                </FieldGroup>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-[#0F172A]">Clear Application Cache</div>
                              <p className="text-xs text-[#64748B] mt-0.5">Clears server-side cache. Users may experience slower load times for a few minutes.</p>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] text-[#D97706] hover:bg-[#FEF3C7] rounded text-sm font-medium transition-colors">
                              <RefreshCw size={14} /> Clear Cache
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-[#0F172A]">Re-index Search</div>
                              <p className="text-xs text-[#64748B] mt-0.5">Rebuilds the search index. Run this after bulk data imports.</p>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] rounded text-sm font-medium transition-colors">
                              <Database size={14} className="text-[#64748B]" /> Re-index
                            </button>
                          </div>
                        </div>
                      </SettingsSection>

                      <div className="mt-8">
                        <SettingsSection title="Danger Zone" isDanger={true}>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[#FECACA] pb-4">
                              <div>
                                <div className="text-sm font-medium text-[#0F172A]">Reset All User Passwords</div>
                                <p className="text-xs text-[#64748B] mt-0.5">Forces all users to reset their password on next login</p>
                              </div>
                              <button className="px-4 py-2 border border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg text-sm font-medium transition-colors">
                                Reset All Passwords
                              </button>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#FECACA] pb-4">
                              <div>
                                <div className="text-sm font-medium text-[#0F172A]">Clear All Audit Logs</div>
                                <p className="text-xs text-[#64748B] mt-0.5">Permanently deletes all audit log records. This cannot be undone.</p>
                              </div>
                              <button className="px-4 py-2 border border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg text-sm font-medium transition-colors">
                                Clear Audit Logs
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-[#0F172A]">Factory Reset</div>
                                <p className="text-xs text-[#64748B] mt-0.5">Resets all settings to default values. User data is preserved.</p>
                              </div>
                              <button className="px-4 py-2 border border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg text-sm font-medium transition-colors">
                                Factory Reset
                              </button>
                            </div>
                          </div>
                        </SettingsSection>
                      </div>
                    </>
                  )}
                  
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-[#E2E8F0] px-8 py-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            {isDirty ? (
              <>
                <div className="w-2 h-2 rounded-full bg-[#D97706]"></div>
                <span className="text-sm text-[#D97706] font-medium">You have unsaved changes</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} className="text-[#16A34A]" />
                <span className="text-sm text-[#64748B]">All changes saved</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isDirty && (
              <button onClick={() => setIsDirty(false)} className="text-sm font-medium text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] px-5 py-2.5 rounded-lg transition-colors">
                Cancel Changes
              </button>
            )}
            <button 
              onClick={handleSave} 
              disabled={!isDirty}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDirty ? 'bg-[#2563EB] hover:bg-blue-700 text-white' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'}`}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
