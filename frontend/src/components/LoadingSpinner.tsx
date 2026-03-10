import './LoadingSpinner.css';

export function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="spinner__ring"></div>
        <div className="spinner__ring"></div>
        <div className="spinner__ring"></div>
      </div>
      <p className="spinner__text">Carregando...</p>
    </div>
  );
}
