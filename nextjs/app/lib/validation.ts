import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Sanitization utilities
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
  });
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .trim();
};

// Search query validation
export const validateSearchQuery = (query: string): string => {
  // Remove potential SQL injection patterns
  const sanitized = query
    .replace(/['";\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '') // Remove extended stored procedure calls
    .replace(/sp_/gi, '') // Remove stored procedure calls
    .slice(0, 100); // Limit length
  
  return sanitized.trim();
};

// Validation schemas
export const userValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  
  email: z
    .string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters'),
  
  role: z
    .enum(['admin', 'user', 'manager'], {
      errorMap: () => ({ message: 'Role must be admin, user, or manager' })
    }),
  
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .transform((val) => val ? sanitizeHtml(val) : val),
});

export const searchValidationSchema = z.object({
  search: z
    .string()
    .max(100, 'Search query too long')
    .optional()
    .transform((val) => val ? validateSearchQuery(val) : val),
  
  role: z
    .enum(['admin', 'user', 'manager', ''])
    .optional(),
  
  page: z
    .number()
    .min(1, 'Page must be at least 1')
    .max(10000, 'Page number too high'),
  
  per_page: z
    .number()
    .min(1, 'Per page must be at least 1')
    .max(100, 'Per page cannot exceed 100'),
});

// Rate limiting helpers
export const createRateLimiter = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, number[]>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing requests for this identifier
    const userRequests = requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    // Check if under limit
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    return true;
  };
};

// API input validation middleware
export const validateApiInput = <T>(schema: z.ZodSchema<T>) => {
  return (input: unknown): T => {
    try {
      return schema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  };
};