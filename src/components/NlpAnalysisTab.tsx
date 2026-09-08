import React, { useState } from 'react';
import { SocialEngineeringAnalysis, ExtractedUrl, ExtractedAttachment, EmailIncident } from '../types';
import {
  Brain,
  Zap,
  AlertOctagon,
  DollarSign,
  UserCheck,
  Link,
  Paperclip,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Clock,
} from 'lucide-react';

interface NlpAnalysisTabProps {
  nlp: SocialEngineeringAnalysis;
  urls: ExtractedUrl[];
  attachments: ExtractedAttachment[];
  incident: EmailIncident;
  onRunAiAnalysis?: () => void;
  aiLoading?: boolean;
  aiResponse?: any;
}

export const NlpAnalysisTab: React.FC<NlpAnalysisTabProps> = ({
  nlp,
  urls,
  attachments,
  incident,
  onRunAiAnalysis,
  aiLoading = false,
  aiResponse,
}) => {
  return (
    <div className="space-y-6 font-mono">
      {/* AI Cognitive Assistant Trigger Banner - Immersive UI Theme */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#00E0FF]/10 border border-[#00E0FF]/30 text-[#00E0FF] shadow-[0_0_10px_rgba(0,224,255,0.2)]">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-white uppercase tracking-widest">
                  Gemini Flash Cognitive Threat Hunter
                </h4>
                <span className="rounded-sm bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 px-2 py-0.5 text-[9px] font-bold uppercase">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                Evaluates behavioral NLP coercion, semantic impersonation, and payment diversion
              </p>
            </div>
          </div>

          <button
            onClick={onRunAiAnalysis}
            disabled={aiLoading}
            className="flex items-center gap-2 rounded-sm bg-[#00E0FF] hover:bg-cyan-300 text-black font-bold px-4 py-2 text-xs transition-colors shadow-[0_0_15px_rgba(0,224,255,0.3)] disabled:opacity-50 uppercase tracking-wider"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Running AI Hunter...</span>
              </>
            ) : (
              <>
                <Brain className="h-3.5 w-3.5" />
                <span>Run Cognitive Assessment</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Response Card if available */}
        {aiResponse && (
          <div className="mt-4 rounded-sm border border-[#1A1A1F] bg-[#050507] p-3 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-2">
              <span className="text-[#00E0FF] font-bold text-xs uppercase tracking-wider">
                Gemini Forensic Synthesis:
              </span>
              <span className="text-gray-500 text-[10px]">Model: gemini-flash</span>
            </div>
            <p className="text-gray-200 leading-relaxed font-sans text-xs">
              {aiResponse.executiveSummary || aiResponse.summary}
            </p>
            {aiResponse.financialOrCredentialRisks && (
              <div className="text-[#FF3D00] text-[11px]">
                <strong>Identified Exploits:</strong> {aiResponse.financialOrCredentialRisks}
              </div>
            )}
            {aiResponse.analystRecommendations && (
              <div className="pt-2 border-t border-[#1A1A1F] text-gray-300 text-[11px]">
                <span className="text-[#00E0FF] font-semibold block mb-1 uppercase tracking-wider text-[10px]">
                  Analyst Playbook Actions:
                </span>
                <ul className="list-disc pl-4 space-y-1">
                  {aiResponse.analystRecommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4 Psychological Coercion Meters - Matches Design HTML Anomaly Detection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Urgency */}
        <div className="h-36 bg-[#0A0A0F] border border-[#1A1A1F] p-3 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider">
              <span className="text-gray-400">Temporal Urgency</span>
              <span className="text-[#FF3D00]">{nlp.urgencyScore > 75 ? 'EXTREME' : 'MODERATE'}</span>
            </div>
            <div className="w-full bg-[#1A1A1F] h-1 rounded-full">
              <div
                className={`h-full rounded-full ${nlp.urgencyScore > 75 ? 'bg-[#FF3D00] shadow-[0_0_8px_#FF3D00]' : 'bg-[#EAB308]'}`}
                style={{ width: `${nlp.urgencyScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[9px] text-gray-500 font-sans leading-tight">
            Strict deadlines and artificial countdown pressure to bypass authorization
          </p>
        </div>

        {/* Authority */}
        <div className="h-36 bg-[#0A0A0F] border border-[#1A1A1F] p-3 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider">
              <span className="text-gray-400">Authority Impersonation</span>
              <span className="text-[#FF3D00]">{nlp.authorityImpersonationScore > 75 ? 'HIGH' : 'ELEVATED'}</span>
            </div>
            <div className="w-full bg-[#1A1A1F] h-1 rounded-full">
              <div
                className={`h-full rounded-full ${nlp.authorityImpersonationScore > 75 ? 'bg-[#FF3D00] shadow-[0_0_8px_#FF3D00]' : 'bg-[#EAB308]'}`}
                style={{ width: `${nlp.authorityImpersonationScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[9px] text-gray-500 font-sans leading-tight">
            Executive or legal authority hierarchy impersonation to compel obedience
          </p>
        </div>

        {/* Payment Diversion */}
        <div className="h-36 bg-[#0A0A0F] border border-[#1A1A1F] p-3 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider">
              <span className="text-gray-400">Payment Diversion</span>
              <span className="text-blue-400">{nlp.financialCoercionScore > 75 ? 'HOSTILE' : 'NORMAL'}</span>
            </div>
            <div className="w-full bg-[#1A1A1F] h-1 rounded-full">
              <div
                className={`h-full rounded-full ${nlp.financialCoercionScore > 75 ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-gray-600'}`}
                style={{ width: `${nlp.financialCoercionScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[9px] text-gray-500 font-sans leading-tight">
            Direct wire transfer or altered payee banking routing diversion
          </p>
        </div>

        {/* Fear / Consequence */}
        <div className="h-36 bg-[#0A0A0F] border border-[#1A1A1F] p-3 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider">
              <span className="text-gray-400">Social Engineering</span>
              <span className="text-[#FF3D00]">{nlp.fearPressureScore > 75 ? 'CRITICAL' : 'MILD'}</span>
            </div>
            <div className="w-full bg-[#1A1A1F] h-1 rounded-full">
              <div
                className={`h-full rounded-full ${nlp.fearPressureScore > 75 ? 'bg-[#FF3D00] shadow-[0_0_8px_#FF3D00]' : 'bg-[#EAB308]'}`}
                style={{ width: `${nlp.fearPressureScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[9px] text-gray-500 font-sans leading-tight">
            Threats of termination, credential revocation, or legal exposure
          </p>
        </div>
      </div>

      {/* Detected Linguistic & Social Engineering Cues */}
      <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 shadow-[0_0_30px_rgba(0,0,0,0.7)]">
        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#EAB308]" />
          NLP Social Engineering & Manipulation Patterns Extracted
        </h4>

        <div className="space-y-2">
          {nlp.detectedCues.map((cue, idx) => (
            <div
              key={`cue-${idx}`}
              className="flex items-start gap-2.5 p-2 rounded-sm border border-[#1A1A1F] bg-[#12121A] text-xs text-gray-200"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF3D00] shrink-0 mt-1.5 shadow-[0_0_4px_#FF3D00]"></span>
              <span>{cue}</span>
            </div>
          ))}
        </div>

        {/* Payment Diversion Callout */}
        {nlp.paymentDiversionDetails && (
          <div className="mt-4 rounded-sm border border-[#FF3D00]/30 bg-[#FF3D00]/5 p-3 text-xs">
            <div className="flex items-center gap-2 text-[#FF3D00] font-bold mb-2 uppercase tracking-wider text-[10px]">
              <DollarSign className="h-4 w-4" />
              <span>Extracted Wire Fraud / Diversion Parameters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-gray-300">
              <div>
                <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Requested Amount:</span>
                <span className="font-bold text-white text-xs">{nlp.paymentDiversionDetails.requestedAmount}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Target Financial Institution:</span>
                <span className="font-semibold text-[#FF3D00] text-xs">{nlp.paymentDiversionDetails.bankName}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Beneficiary / Account Reference:</span>
                <span className="text-gray-200 break-all text-xs">{nlp.paymentDiversionDetails.accountReference}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extracted URLs & Attachment Forensics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* URLs */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Link className="h-4 w-4 text-[#00E0FF]" />
              Extracted Hyperlinks & Redirects ({urls.length})
            </h4>
          </div>

          {urls.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">
              No outbound URLs detected in message body.
            </p>
          ) : (
            <div className="space-y-2">
              {urls.map((u, i) => (
                <div key={i} className="rounded-sm border border-[#1A1A1F] bg-[#12121A] p-2.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF3D00] font-semibold truncate max-w-[220px]">
                      {u.domain}
                    </span>
                    <span className="rounded-sm bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30 px-2 py-0.5 text-[9px] font-bold uppercase">
                      SAFETY: {u.safetyScore}/100
                    </span>
                  </div>
                  <div className="text-gray-400 break-all text-[10px]">
                    {u.originalUrl}
                  </div>
                  {u.threatCategory && (
                    <div className="text-[#EAB308] text-[9px] pt-0.5">
                      Threat Tag: {u.threatCategory}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        <div className="rounded-md border border-[#1A1A1F] bg-[#0A0A0F] p-4 space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-[#1A1A1F] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-[#00E0FF]" />
              Extracted Attachments & Payloads ({attachments.length})
            </h4>
          </div>

          {attachments.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">
              No binary attachments enclosed in this email.
            </p>
          ) : (
            <div className="space-y-2">
              {attachments.map((att, i) => (
                <div key={i} className="rounded-sm border border-[#1A1A1F] bg-[#12121A] p-2.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold truncate max-w-[220px]">
                      {att.filename}
                    </span>
                    <span
                      className={`rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase ${
                        att.verdict === 'malicious'
                          ? 'bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30'
                          : 'bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30'
                      }`}
                    >
                      {att.verdict}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400 text-[10px]">
                    <span>Size: {att.filesize}</span>
                    <span>Type: {att.filetype}</span>
                  </div>
                  {att.isMacroEnabled && (
                    <div className="rounded-sm bg-[#FF3D00]/10 border border-[#FF3D00]/30 p-1.5 text-[#FF3D00] text-[10px] font-bold">
                      WARNING: Contains active VBA Macro Execution Payload!
                    </div>
                  )}
                  <div className="text-[9px] text-gray-500 truncate">
                    SHA-256: {att.sha256}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
