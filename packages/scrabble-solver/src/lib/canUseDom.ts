const canUseDom = Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);

export default canUseDom;
