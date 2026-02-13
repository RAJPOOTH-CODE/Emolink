import { useState, useEffect } from 'react';
import { decodeData } from './utils/encoding';
import CreatorView from './components/CreatorView';
import ReceiverView from './components/ReceiverView';

function App() {
  const [cardData, setCardData] = useState(null);
  const [view, setView] = useState('loading');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('card');

    if (encoded) {
      const decoded = decodeData(encoded);
      if (decoded) {
        setCardData(decoded);
        setView('receiver');
      } else {
        setView('creator');
      }
    } else {
      setView('creator');
    }
  }, []);

  if (view === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {view === 'creator' ? (
        <CreatorView />
      ) : (
        <ReceiverView data={cardData} onReplay={() => window.location.reload()} />
      )}
    </div>
  );
}

export default App;
