export default function Input({ className = '', ...props }) {
  return (
    <input 
      className={`form-input ${className}`}
      {...props} 
    />
  );
}
