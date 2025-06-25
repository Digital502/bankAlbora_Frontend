import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMyCard } from '../../services';

export const useMyCards = (onFinish) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const response = await getMyCard();
        if (response.error) throw response.e;

        setCards(response.cards || [])
      } catch (error) {
        setCards([]);
        if (cards.length === 0) {
          toast.arguments("No tienes tarjetas emitidas");
        }else {
          toast.error("Error al obtener las tarjetas emitidas");
        }
      } finally {
        setLoading(false);
        if (onFinish) onFinish();
      }
    };

    fetchCards();
  }, [onFinish]);

  return {
    cards,
    loading,
  };
};
