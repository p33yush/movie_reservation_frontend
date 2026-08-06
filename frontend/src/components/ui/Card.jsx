export default function Card({ children, className = '', style = {} }) {
  return (
    <div 
      className={`glass-panel ${className}`} 
      style={{ padding: '30px', ...style }}
    >
      {children}
    </div>
  );
}
