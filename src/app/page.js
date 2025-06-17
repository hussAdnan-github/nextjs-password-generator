'use client';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import md4 from 'js-md4';

// Style objects (from previous English version)
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
    backgroundColor: '#ffffff',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '2rem',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#34495e',
  },
  select: {
    width: '100%',
    padding: '12px',
    boxSizing: 'border-box',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    fontSize: '1rem',
    appearance: 'none',
    backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007bff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right .7em top 50%',
    backgroundSize: '.65em auto',
    paddingRight: '2.5em',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    display: 'block',
    width: '100%',
    marginTop: '10px',
  },
  buttonActive: {
    transform: 'scale(0.98)',
  },
  buttonLoading: { // Style for loading button
    backgroundColor: '#0056b3', // Darker blue, similar to hover
    cursor: 'not-allowed',
    opacity: 0.8,
  },
  outputSection: {
    marginTop: '25px',
    padding: '20px',
    border: '1px solid #ecf0f1',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  },
  outputHeader: {
    marginTop: '0',
    marginBottom: '10px',
    color: '#2c3e50',
    fontSize: '1.2rem',
  },
  pre: {
    margin: '0',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    flexGrow: 1,
    backgroundColor: '#e9ecef',
    padding: '10px 15px',
    borderRadius: '4px',
    color: '#495057',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  copyButton: {
    marginLeft: '15px',
    padding: '8px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
  },
  timeToCrackText: {
    marginTop: '15px',
    fontSize: '1em',
    color: '#dc3545',
    fontWeight: '500',
  },
  hashingTimeText: {
    marginTop: '10px',
    fontSize: '0.9em',
    color: '#17a2b8',
  },
  error: {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '0.95rem',
  },
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
};


export default function Home() {
  const [hashType, setHashType] = useState('MD5');
  const [charLength, setCharLength] = useState(8);
  const [symbolCount, setSymbolCount] = useState(3);

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [timeToCrack, setTimeToCrack] = useState('');
  const [hashingDurationMs, setHashingDurationMs] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <-- New state for loading

  const [isGenerateHovered, setIsGenerateHovered] = useState(false);
  const [isGenerateActive, setIsGenerateActive] = useState(false);
  const [isCopyPassHovered, setIsCopyPassHovered] = useState(false);
  const [isCopyPassActive, setIsCopyPassActive] = useState(false);
  const [isCopyHashHovered, setIsCopyHashHovered] = useState(false);
  const [isCopyHashActive, setIsCopyHashActive] = useState(false);

  const ALL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const ALL_SYMBOLS = '!@#$%^&*()_+-=[]{};\':"\\|,.<>/?';

  const generateRandomPassword = (length, numSymbols) => {
    // ... (rest of the function is the same)
    let password = '';
    const totalLength = parseInt(length) + parseInt(numSymbols);

    if (totalLength <= 0) {
      setError('Total password length must be greater than zero.');
      return '';
    }
    setError('');

    let passwordArray = [];
    for (let i = 0; i < length; i++) {
      passwordArray.push(ALL_CHARS.charAt(Math.floor(Math.random() * ALL_CHARS.length)));
    }
    for (let i = 0; i < numSymbols; i++) {
      passwordArray.push(ALL_SYMBOLS.charAt(Math.floor(Math.random() * ALL_SYMBOLS.length)));
    }

    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    
    return passwordArray.join('');
  };

  const estimateTimeToCrack = (password, currentCharlength, currentSymbolCount) => {
    // ... (rest of the function is the same)
    if (!password || password.length === 0) {
      return 'Cannot estimate (empty password)';
    }

    const length = password.length;
    let characterPoolSize = 0;

    if (parseInt(currentCharlength) > 0) {
        characterPoolSize += ALL_CHARS.length;
    }
    if (parseInt(currentSymbolCount) > 0) {
        if (characterPoolSize === 0) { 
            characterPoolSize = ALL_SYMBOLS.length;
        } else { 
            characterPoolSize = ALL_CHARS.length + ALL_SYMBOLS.length;
        }
    }
    
    if (characterPoolSize === 0 && length > 0) {
        if (/[a-z]/.test(password)) characterPoolSize += 26;
        if (/[A-Z]/.test(password)) characterPoolSize += 26;
        if (/[0-9]/.test(password)) characterPoolSize += 10;
        if (/[!@#$%^&*()_+-=\[\]{};':"\\|,.<>\/?]/.test(password)) characterPoolSize += ALL_SYMBOLS.length;
    }
    if (characterPoolSize === 0) return "Cannot determine character pool";

    const guessesPerSecond = 10 * 1000 * 1000 * 1000; // 10 billion

    let combinations;
    try {
        combinations = BigInt(characterPoolSize) ** BigInt(length);
    } catch (e) {
        return "Astronomical number of combinations (practically impossible)";
    }
    
    if (combinations === Infinity || typeof combinations === 'number' && isNaN(combinations)) {
        return "Astronomical number of combinations (practically impossible)";
    }

    const secondsToCrack = Number(combinations) / guessesPerSecond;

    if (secondsToCrack < 0.000001) return "Instantly (extremely weak)";
    if (secondsToCrack < 0.001) return `${(secondsToCrack * 1000000).toFixed(0)} microseconds`;
    if (secondsToCrack < 1) return `${(secondsToCrack * 1000).toFixed(0)} milliseconds`;
    if (secondsToCrack < 60) return `${secondsToCrack.toFixed(1)} seconds`;
    
    const minutes = secondsToCrack / 60;
    if (minutes < 60) return `${minutes.toFixed(1)} minutes`;
    
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} hours`;
    
    const days = hours / 24;
    if (days < 30) return `${days.toFixed(1)} days`;

    const months = days / 30.4375;
    if (months < 12) return `${months.toFixed(1)} months`;

    const years = days / 365.25;
    if (years < 1000) return `${years.toFixed(1)} years`;
    if (years < 1000000) return `${(years / 1000).toFixed(1)} thousand years`;
    if (years < 1000000000) return `${(years / 1000000).toFixed(1)} million years`;
    if (years < 1000000000000) return `${(years / 1000000000).toFixed(1)} billion years`;
    
    return "Countless eons (extremely strong)";
  };

  const handleGeneratePassword = async () => { // <-- Made async for potential future use, not strictly needed for setTimeout
    setIsLoading(true); // <-- Set loading to true
    setGeneratedPassword(''); // Clear previous results
    setHashedPassword('');
    setTimeToCrack('');
    setHashingDurationMs(null);
    setError('');

    // Simulate a slight delay to make the loading state more visible for fast operations
    // In a real app with very fast crypto, you might not even need this or adjust the delay.
    await new Promise(resolve => setTimeout(resolve, 50)); // Small delay

    try {
      const pass = generateRandomPassword(charLength, symbolCount);
      if (!pass) {
          setIsLoading(false); // Reset loading if no pass generated
          return;
      }

      setGeneratedPassword(pass);
      setTimeToCrack(estimateTimeToCrack(pass, charLength, symbolCount));

      let hashOutput = '';
      const startTime = performance.now();

      if (hashType === 'MD5') {
        hashOutput = CryptoJS.MD5(pass).toString(CryptoJS.enc.Hex);
      } else if (hashType === 'SHA1') {
        hashOutput = CryptoJS.SHA1(pass).toString(CryptoJS.enc.Hex);
      } else if (hashType === 'NTLM') {
        const utf16lePassword = [];
        for (let i = 0; i < pass.length; i++) {
          const charCode = pass.charCodeAt(i);
          utf16lePassword.push(charCode & 0xFF);
          utf16lePassword.push(charCode >> 8);
        }
        const hash = md4.create();
        hash.update(Uint8Array.from(utf16lePassword));
        hashOutput = hash.hex();
      }
      const endTime = performance.now();
      setHashingDurationMs(endTime - startTime);
      setHashedPassword(hashOutput);

    } catch (err) {
      console.error("Hashing error:", err);
      setError(`Error during hashing: ${err.message}`);
      setHashedPassword(''); // Clear hash on error
      setHashingDurationMs(null); // Clear duration on error
    } finally {
      setIsLoading(false); // <-- Set loading to false in finally block
    }
  };
  
  useEffect(() => {
    if (generatedPassword && !isLoading) { // Don't re-estimate if currently loading
      setTimeToCrack(estimateTimeToCrack(generatedPassword, charLength, symbolCount));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charLength, symbolCount, generatedPassword, isLoading]);


  const copyToClipboard = (text) => {
    // ... (rest of the function is the same)
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text)
        .then(() => alert('Copied to clipboard!'))
        .catch(err => console.error('Copying error: ', err));
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Password Generator & Hasher</title>
        <meta name="description" content="Generate strong passwords, hash them, estimate crack time, and measure hashing speed." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 style={styles.title}>Password Generator & Hasher</h1>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.formGroup}>
        <label htmlFor="hashType" style={styles.label}>Hashing Algorithm:</label>
        <select id="hashType" value={hashType} onChange={(e) => setHashType(e.target.value)} style={styles.select} disabled={isLoading}>
          <option className='text-black' value="MD5">MD5</option>
          <option className='text-black' value="SHA1">SHA1</option>
          <option className='text-black' value="NTLM">NTLM</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="charLength" style={styles.label}>Number of Alphanumeric Characters:</label>
        <select id="charLength" value={charLength} onChange={(e) => setCharLength(parseInt(e.target.value))} style={styles.select} disabled={isLoading}>
          <option className='text-black' value="0">0 (None)</option>
          <option className='text-black' value="3">3 Characters</option>
          <option className='text-black' value="5">5 Characters</option>
          <option className='text-black' value="8">8 Characters</option>
          <option className='text-black' value="12">12 Characters</option>
          <option className='text-black' value="16">16 Characters</option>
          <option className='text-black' value="20">20 Characters</option>
          
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="symbolCount" style={styles.label}>Number of Symbols:</label>
        <select id="symbolCount" value={symbolCount} onChange={(e) => setSymbolCount(parseInt(e.target.value))} style={styles.select} disabled={isLoading}>
          <option className='text-black' value="0">0 (None)</option>
          <option className='text-black' value="3">3 Symbols</option>
          <option className='text-black'  value="5">5 Symbols</option>
          <option className='text-black' value="8">8 Symbols</option>
          <option className='text-black' value="12">12 Symbols</option>
          <option className='text-black' value="16">16 Symbols</option>
        </select>
      </div>

      <button 
        onClick={handleGeneratePassword} 
        style={{
            ...styles.button, 
            ...(isLoading ? styles.buttonLoading : (isGenerateHovered ? {backgroundColor: '#0056b3'} : {})),
            ...(isGenerateActive && !isLoading ? styles.buttonActive : {})
        }}
        onMouseOver={() => !isLoading && setIsGenerateHovered(true)}
        onMouseOut={() => setIsGenerateHovered(false)}
        onMouseDown={() => !isLoading && setIsGenerateActive(true)}
        onMouseUp={() => setIsGenerateActive(false)}
        onTouchStart={() => !isLoading && setIsGenerateActive(true)}
        onTouchEnd={() => setIsGenerateActive(false)}
        disabled={isLoading} // <-- Disable button when loading
      >
        {isLoading ? 'Processing...' : 'Generate Password & Hash'} {/* <-- Change text when loading */}
      </button>

      {generatedPassword && !isLoading && ( // <-- Hide output sections while loading new data
        <div style={styles.outputSection}>
          <h3 style={styles.outputHeader}>Generated Password:</h3>
          <div style={styles.flexRow}>
            <pre style={{...styles.pre, flexGrow: 1}}>{generatedPassword}</pre>
            <button 
                onClick={() => copyToClipboard(generatedPassword)} 
                style={{
                    ...styles.copyButton,
                    backgroundColor: isCopyPassHovered ? '#218838' : styles.copyButton.backgroundColor,
                    ...(isCopyPassActive ? styles.buttonActive : {})
                }}
                onMouseOver={() => setIsCopyPassHovered(true)}
                onMouseOut={() => setIsCopyPassHovered(false)}
                onMouseDown={() => setIsCopyPassActive(true)}
                onMouseUp={() => setIsCopyPassActive(false)}
                onTouchStart={() => setIsCopyPassActive(true)}
                onTouchEnd={() => setIsCopyPassActive(false)}
            >
                Copy
            </button>
          </div>
          {timeToCrack && (
            <p style={styles.timeToCrackText}>
              <strong>Estimated time to crack:</strong> {timeToCrack}
            </p>
          )}
        </div>
      )}

      {hashedPassword && !isLoading && ( // <-- Hide output sections while loading new data
        <div style={styles.outputSection}>
          <h3 style={styles.outputHeader}>Calculated Hash ({hashType}):</h3>
          <div style={styles.flexRow}>
            <pre style={{...styles.pre, flexGrow: 1, direction: 'ltr', textAlign: 'left' }}>{hashedPassword}</pre>
            <button 
                onClick={() => copyToClipboard(hashedPassword)} 
                style={{
                    ...styles.copyButton,
                    backgroundColor: isCopyHashHovered ? '#218838' : styles.copyButton.backgroundColor,
                    ...(isCopyHashActive ? styles.buttonActive : {})
                }}
                onMouseOver={() => setIsCopyHashHovered(true)}
                onMouseOut={() => setIsCopyHashHovered(false)}
                onMouseDown={() => setIsCopyHashActive(true)}
                onMouseUp={() => setIsCopyHashActive(false)}
                onTouchStart={() => setIsCopyHashActive(true)}
                onTouchEnd={() => setIsCopyHashActive(false)}
            >
                Copy
            </button>
          </div>
          {hashingDurationMs !== null && (
            <p style={styles.hashingTimeText}>
              <strong>Hashing duration:</strong> {hashingDurationMs.toFixed(2)} ms
            </p>
          )}
        </div>
      )}
    </div>
  );
}