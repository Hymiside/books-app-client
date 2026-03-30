import Modal from './Modal';

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel, confirmLabel = 'Подтвердить', danger }: Props) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p style={{ marginBottom: '1.5rem', color: '#374151' }}>{message}</p>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel}>Отмена</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
