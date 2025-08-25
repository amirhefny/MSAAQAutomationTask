// utils/RandomData.ts
export class RandomData {
    /**
     * Generate random email
     */
    static email(domain: string = "example.com"): string {
      const randomString = Math.random().toString(36).substring(2, 10);
      return `${randomString}@${domain}`;
    }
  
    /**
     * Generate random password (letters + numbers + symbols)
     */
    static password(length: number = 12): string {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
      return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
    }
  
    /**
     * Generate random number between min and max
     */
    static number(min: number = 0, max: number = 1000): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    /**
     * Generate random phone number
     */
    static phoneNumber(countryCode: string = "+1"): string {
      const number = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
      return `${countryCode}${number}`;
    }
  
    /**
     * Generate random string of specific length
     */
    static string(length: number = 8): string {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
    }
  
    /**
     * Generate random alphanumeric string of specific length
     */
    static alphaNumeric(length: number = 10): string {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
    }
    /**
   * Generate random date between given range
   */
  static date(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
  
  }
  