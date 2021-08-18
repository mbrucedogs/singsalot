interface GridRowProps { 
  columns: JSX.Element[];
  gridTemplateColumns: string; 
  onClick?: () => void; 
}

export const GridRow: React.FC<GridRowProps> = ({ columns, gridTemplateColumns, onClick }) => {
  const action = onClick ? { onClick: onClick } : {};
  return (
    <div className="row-container" {...action}>
      <div className="row" style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>
        {columns.map((c, index) => <div key={index}>{c}</div>)}
      </div>
    </div>
  );
};

export default GridRow;