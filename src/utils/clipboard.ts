import { useAuditLog } from '../hooks/useAuditLog';

export class ClipboardManager {
  private static timeouts: Map<string, NodeJS.Timeout> = new Map();

  static async copyToClipboard(text: string, description: string = 'text', clearAfter: number = 30000): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      
      // Clear any existing timeout for this type
      const existingTimeout = this.timeouts.get(description);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new timeout to clear clipboard
      const timeout = setTimeout(() => {
        navigator.clipboard.writeText('').catch(() => {
          // Ignore errors when clearing clipboard
        });
        this.timeouts.delete(description);
      }, clearAfter);

      this.timeouts.set(description, timeout);

      // Show notification
      this.showNotification(`${description} copied to clipboard (will clear in ${clearAfter / 1000}s)`);
      
    } catch (error) {
      throw new Error('Failed to copy to clipboard');
    }
  }

  private static showNotification(message: string): void {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Hook for using clipboard functionality
export const useClipboard = () => {
  const { addLog } = useAuditLog();

  const copyText = async (text: string, description: string = 'text', clearAfter: number = 30000) => {
    await ClipboardManager.copyToClipboard(text, description, clearAfter);
    addLog(`Copied ${description} to clipboard`);
  };

  return { copyText };
};