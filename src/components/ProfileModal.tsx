import { useEffect, useRef } from "react";
import type { Language } from "../config/navigation";
import { profile } from "../data/profile";
import profileImage from "../assets/branding/foto-perfil.webp";
import FontIcon from "./FontIcon";

export default function ProfileModal({ language, onClose }: { language: Language; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const copy = profile[language];

  useEffect(() => {
    const dialog = dialogRef.current!;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="profile-modal"
      aria-labelledby="profile-modal-name"
      aria-describedby="profile-modal-role"
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        }
      }}
      onClose={() => {
        if (!dialogRef.current?.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <article className="profile-modal-card">
        <button type="button" className="profile-modal-close" aria-label={copy.close} onClick={() => dialogRef.current?.close()}>
          <FontIcon className="fa-solid fa-xmark" />
        </button>
        <div className="profile-modal-portrait">
          <img src={profileImage} alt={profile.name} width="640" height="640" decoding="async" />
        </div>
        <div className="profile-modal-copy">
          <p className="profile-modal-focus">{copy.focus}</p>
          <h2 id="profile-modal-name">{profile.name}</h2>
          <p id="profile-modal-role">{copy.role}</p>
          <p className="profile-modal-location">{profile.location}</p>
          <p className="profile-modal-availability"><span aria-hidden="true" />{copy.availability}</p>
          <blockquote>{copy.phrase}</blockquote>
        </div>
      </article>
    </dialog>
  );
}
