import { Award, CheckCircle, Clock, FileText, ShieldCheck, BookOpen, Star, Zap, Target } from 'lucide-react';

const ICON_MAP = {
  default: CheckCircle,
  learning: BookOpen,
  achievement: Star,
  technical: Zap,
  strategic: Target
};

/**
 * CertificateTemplate Component
 * 
 * Renders a high-quality certificate with dynamic data overlaid on a background image.
 * Uses portrait A4 proportions (1:1.414).
 * 
 * @param {Object} props
 * @param {Object} props.data - Certificate data
 * @param {string} props.data.courseTitle - Title of the course
 * @param {string} props.data.recipientName - Name of the person receiving the certificate
 * @param {string} props.data.completionDate - Date of completion
 * @param {string} props.data.certificateId - Unique certificate ID
 * @param {Array} props.data.modules - List of modules completed
 * @param {string} props.className - Optional additional CSS classes
 */
const CertificateTemplate = ({ data, className = "" }) => {
  const {
    courseTitle = "Full Stack Web Development",
    recipientName = "Alex Johnson",
    completionDate = "May 13, 2026",
    certificateId = "CERT-SLG-2026-0001",
    modules = [
      { title: "Core Architecture", description: "Deep dive into system design and hexagonal architecture." },
      { title: "Frontend Excellence", description: "Mastering React, Vite, and modern UI/UX principles." },
      { title: "Backend Security", description: "Implementing robust IAM and secure API layers." }
    ]
  } = data || {};

  return (
    <div className={`relative w-full overflow-hidden shadow-2xl bg-white ${className}`} 
         style={{ aspectRatio: '1 / 1.414', containerType: 'size' }}>
      
      {/* Background Image */}
      <img 
        src="/certificates/background.png" 
        alt="Certificate Background"
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      {/* Dynamic Overlay Layer */}
      <div className="absolute inset-0 flex flex-col items-center text-slate-800 pointer-events-none">
        
        {/* Course Title - positioned in the blue section (usually top-middle) */}
        <div className="absolute top-[22%] left-0 w-full text-center px-[10%]">
          <h2 className="text-[3cqw] font-bold tracking-wide uppercase text-white drop-shadow-sm">
            {courseTitle}
          </h2>
        </div>

        {/* Recipient Name - centered large text */}
        <div className="absolute top-[38%] left-0 w-full text-center">
          <p className="text-[1.5cqw] italic font-medium text-slate-500 mb-2">This is to certify that</p>
          <h1 className="text-[6cqw] font-serif font-bold text-slate-900 border-b-2 border-slate-200 inline-block px-8 pb-2">
            {recipientName}
          </h1>
        </div>

        {/* Description / Completion Text */}
        <div className="absolute top-[52%] left-0 w-full text-center px-[15%]">
          <p className="text-[1.8cqw] leading-relaxed text-slate-600">
            has successfully completed the comprehensive training program and demonstrated 
            exceptional proficiency in the modules listed below.
          </p>
        </div>

        {/* Modules Section */}
        <div className="absolute top-[62%] left-[10%] right-[10%] grid grid-cols-1 gap-[1cqw]">
          <h3 className="text-[1.5cqw] font-bold uppercase tracking-widest text-slate-400 mb-2 border-l-4 border-blue-500 pl-3">
            Completed Modules
          </h3>
          <div className="grid grid-cols-1 gap-[0.8cqw]">
            {modules.map((module, index) => {
              const IconComponent = ICON_MAP[module.icon] || ICON_MAP.default;
              return (
                <div key={index} className="flex items-start gap-[1.5cqw] bg-white/40 backdrop-blur-[2px] p-[1.5cqw] rounded-lg border border-slate-200/50 shadow-sm">
                  <div className="mt-1">
                    <IconComponent className="w-[2cqw] h-[2cqw] text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-[1.6cqw] font-bold text-slate-800">{module.title}</h4>
                    <p className="text-[1.2cqw] text-slate-500 leading-tight">{module.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer: Date and Certificate ID */}
        <div className="absolute bottom-[8%] left-[10%] right-[10%] flex justify-between items-end border-t border-slate-200 pt-[2cqw]">
          <div className="text-left">
            <p className="text-[1cqw] uppercase text-slate-400 font-bold mb-1">Completion Date</p>
            <p className="text-[1.4cqw] font-medium text-slate-800 flex items-center gap-2">
              <Clock className="w-[1.2cqw] h-[1.2cqw]" /> {completionDate}
            </p>
          </div>
          
          {/* Signature Placeholder or Logo */}
          <div className="text-center">
             <div className="h-[4cqw] border-b border-slate-400 min-w-[15cqw] mb-1 font-serif text-[2.5cqw]">
               IONA TECH
             </div>
             <p className="text-[1cqw] uppercase text-slate-400 font-bold">Authorized Signature</p>
          </div>

          <div className="text-right">
            <p className="text-[1cqw] uppercase text-slate-400 font-bold mb-1">Certificate ID</p>
            <p className="text-[1.4cqw] font-mono text-slate-800 flex items-center gap-2 justify-end">
               {certificateId} <ShieldCheck className="w-[1.2cqw] h-[1.2cqw] text-green-600" />
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateTemplate;
