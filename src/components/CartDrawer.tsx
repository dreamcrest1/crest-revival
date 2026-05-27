import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { WhatsAppIcon } from '@/components/SocialIcons';
import CheckoutDialog from '@/components/checkout/CheckoutDialog';

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const whatsappMsg = encodeURIComponent(
    `Hi! I'd like to order the following:\n${items.map(i => `• ${i.name} x${i.quantity} (${i.price})`).join('\n')}\n\nTotal: ₹${totalPrice.toFixed(0)}`
  );

  return (
    <>
    <AnimatePresence>

      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[10000] w-full max-w-md bg-card border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">Your Cart</h2>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">Add products to get started</p>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-3 bg-secondary/30 border border-border/50 rounded-xl p-3"
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-contain bg-secondary/50" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-primary">{item.price}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded-md bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors ml-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total ({totalItems} items)</span>
                  <span className="font-display font-bold text-xl text-primary">₹{totalPrice.toFixed(0)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setIsOpen(false); setCheckoutOpen(true); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <CreditCard className="w-4 h-4" /> Pay ₹{totalPrice.toFixed(0)}
                  </button>
                  <a
                    href={`https://wa.me/916357998730?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#25D366] hover:text-white transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                </div>

                <button onClick={clearCart} className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1">
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    <CheckoutDialog
      open={checkoutOpen}
      onClose={() => setCheckoutOpen(false)}
      items={items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))}
      totalAmount={totalPrice}
    />
    </>
  );
};

export default CartDrawer;
