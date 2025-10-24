/**
 * Copy text to clipboard with fallback support for environments
 * where the Clipboard API is blocked by permissions policy
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first (only if available and not blocked)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Silently fall through to fallback method
      // The error is expected in iframe/embedded contexts
    }
  }

  // Fallback method using deprecated execCommand
  // This works in more environments including iframes
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // Make it invisible and non-interactive
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    textarea.setAttribute('readonly', '');
    
    document.body.appendChild(textarea);
    
    // Select the text
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    
    // Copy to clipboard
    const successful = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textarea);
    
    return successful;
  } catch (error) {
    // Only log if both methods fail
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}