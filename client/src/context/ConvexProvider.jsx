import { ConvexProvider as BaseConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';
import { useState, createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://giddy-lyrebird-252.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

const ConvexContext = createContext();

export const useConvexMutation = (functionName) => {
  return async (args) => {
    try {
      return await convex.mutation(functionName, args);
    } catch (error) {
      console.error(`Error calling mutation ${functionName}:`, error);
      throw error;
    }
  };
};

export const useConvexQuery = (functionName, args) => {
  try {
    return convex.query(functionName, args);
  } catch (error) {
    console.error(`Error calling query ${functionName}:`, error);
    return null;
  }
};

export const ConvexProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const setConvexAuth = () => {
      convex.setAuth(async () => {
        const user = auth.currentUser;
        if (!user) return null;
        return await user.getIdToken(true);
      });
    };

    setConvexAuth();
    const unsubscribe = onAuthStateChanged(auth, () => {
      setConvexAuth();
    });

    return () => unsubscribe();
  }, []);

  return (
    <ConvexContext.Provider value={{ isConnected, convex }}>
      <BaseConvexProvider client={convex}>
        {children}
      </BaseConvexProvider>
    </ConvexContext.Provider>
  );
};

export const useConvexContext = () => {
  const context = useContext(ConvexContext);
  if (!context) {
    throw new Error('useConvexContext must be used within ConvexProvider');
  }
  return context;
};
