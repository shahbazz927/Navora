import { useGatedOfficialLink } from '../hooks/useGatedOfficialLink';
import PhonePromptModal from './PhonePromptModal';

/**
 * GatedOfficialLink — self-contained official outbound link.
 * Asks for name + 10-digit mobile (once per session, no login) before opening.
 * Closing the popup never opens the link.
 *
 * Props mirror <a> plus gating metadata:
 *   url (required), linkLabel, section, collegeSlug, collegeName,
 *   scholarshipId, scholarshipName, className, title, children
 */
export default function GatedOfficialLink({
  url,
  linkLabel = 'Official link',
  section = 'official',
  collegeSlug = null,
  collegeName = null,
  scholarshipId = null,
  scholarshipName = null,
  className = '',
  title = '',
  children,
}) {
  const { gateLink, phoneModal, closePhoneModal, submitPhone } = useGatedOfficialLink();
  if (!url) return null;
  const payload = { url, linkLabel, section, collegeSlug, collegeName, scholarshipId, scholarshipName };
  return (
    <>
      <a
        href={url}
        onClick={(e) => gateLink(e, payload)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={title || linkLabel}
      >
        {children}
      </a>
      <PhonePromptModal
        open={phoneModal.open}
        initialName={phoneModal.initialName}
        initialPhone={phoneModal.initialPhone || ''}
        linkLabel={phoneModal.payload?.linkLabel || linkLabel}
        onSubmit={submitPhone}
        onClose={closePhoneModal}
      />
    </>
  );
}
