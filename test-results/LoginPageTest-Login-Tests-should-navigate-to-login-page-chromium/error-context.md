# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - img "مساق" [ref=e8]
          - button "English" [ref=e9] [cursor=pointer]:
            - generic [ref=e14] [cursor=pointer]: English
        - heading "تسجيل الدخول" [level=3] [ref=e15]
        - generic [ref=e16]:
          - generic [ref=e17]:
            - generic [ref=e18]:
              - text: البريد الالكتروني المُستخدم
              - generic [ref=e19]: "*"
            - textbox [ref=e20]
          - generic [ref=e21]:
            - generic [ref=e22]:
              - text: كلمة المرور
              - generic [ref=e23]: "*"
            - generic [ref=e24]:
              - textbox [ref=e25]
              - generic "Show password" [ref=e26]:
                - img
            - link "هل نسيت كلمة المرور؟" [ref=e27] [cursor=pointer]:
              - /url: /forgot-password
          - generic [ref=e29]:
            - checkbox [ref=e30] [cursor=pointer]
            - checkbox
            - generic [ref=e33]: سجل الخروج بعد انتهاء الجلسة
          - button "تسجيل الدخول" [ref=e35] [cursor=pointer]
      - img [ref=e36]
    - region "Notifications alt+T"
  - alert [ref=e37]
  - button "دردشة مفتوحة" [ref=e38] [cursor=pointer]
```