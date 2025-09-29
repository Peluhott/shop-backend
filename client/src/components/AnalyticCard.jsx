import Card from 'react-bootstrap/Card';

function AnalyticCard({ title, value, color = "info", textColor = "white", unit = "" }) {
  return (
    <Card bg={color} text={textColor} className="mb-3" style={{ minWidth: '180px', maxWidth: '220px' }}>
      <Card.Body>
        <Card.Title style={{ fontSize: '1.1rem' }}>{title}</Card.Title>
        <Card.Text style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {unit === "$" ? `${unit}${value}` : `${value}${unit}`}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default AnalyticCard;