---
title: "שלב 1 — התחברות"
---

זהו ה-feature הראשון שתכתבו ביד ב-Kotlin (ימים 11–13). הוא נגמר ב-MR ובסקירת אמצע (יום 13). המטרה: מסך התחברות אמיתי שמתחבר ל-backend שלכם, שומר token, ומדלג על ההתחברות בהפעלה מחדש.

## המשימה

- **מסך התחברות** (תעודת זהות / שם משתמש + סיסמה) → `POST /auth/login` → שמירת ה-JWT → ניווט למסך המפה (placeholder בשלב זה).
- **הפעלה מחדש** של האפליקציה מדלגת על ההתחברות אם קיים token תקף.
- **logout** מנקה את ה-token.
- מסך הרשמה (register) — stretch אופציונלי בתוך שלושת הימים.

## דרישות טכניות

- **שכבת API:** OkHttp client + kotlinx.serialization. **לא Retrofit** — תואמים את מה ש-alpha-mobile משתמשת בו.
- **token ב-AndroidX DataStore** (Preferences). גשר: "כמו `localStorage`, אבל אסינכרוני ומבוסס-`Flow`". מצב ההתחברות נחשף כ-`Flow<Boolean>`.
- **`ScreenState`** מכסה `idle` / `loading` / `error(message)` / `success`. ה-UX של השגיאה חשוב — "סיסמה שגויה" ו"השרת לא זמין" הן הודעות שונות.
- **ארכיטקטורה לפי תבנית הצוות** ([MVVM ו-Koin](/alpha-onboarding/foundations/mvvm-koin/)): ViewModel `interface`+`Impl`, repository, מודול Koin ל-feature.
- **Unit tests:** happy path; מסלול סיסמה-שגויה; token-נשמר-בהצלחה (עם repo ממוקק).

## רמזים (בלי לפתור)

- alpha-mobile שומרת את ה-auth שלה ב-`app/src/main/java/com/even/alpha/core/auth/` (`AuthApi.kt`, `AuthRepository.kt`) — קראו לקבלת השראה, **אל תעתיקו-הדביקו** (ה-auth של אלפא הוא SSO, אחר משלכם).
- ה-DataStore: [המדריך הרשמי](https://developer.android.com/topic/libraries/architecture/datastore).
- **OkHttp Interceptor** — הדרך הנקייה לצרף `Authorization: Bearer <token>` לכל קריאה עתידית. במקום להוסיף את ה-header ידנית בכל בקשה, ה-interceptor עושה זאת אוטומטית לכל הקריאות. alpha-mobile עושה בדיוק את זה ב-`app/src/main/java/com/even/alpha/core/network/AuthInterceptor.kt` — שווה הצצה. תקימו אותו עכשיו; הוא יישא את ה-token עבור כל השלבים הבאים.

## מדיניות AI

- **Navigator** — כן.
- **Generator** — רק אם המנטור פתח אותו בשער 1, ואז רק ל-boilerplate (DTOs של serialization) — **אף פעם** ל-ViewModel.

## כתובת ה-backend ומכשיר היעד

ה-backend רץ על `localhost` של מחשב הפיתוח. איך מכשיר היעד מגיע אליו:

| מכשיר היעד | כתובת בסיס |
|---|---|
| אמולטור | `http://10.0.2.2:3000` (כך האמולטור רואה את ה-localhost של המארח) |
| מכשיר פיזי | ה-IP של מחשב הפיתוח ב-LAN, **או** `adb reverse tcp:3000 tcp:3000` ואז `localhost` |

**הפכו את כתובת הבסיס לקונפיגורבילית** (לא hardcoded) — זה השלב שבו הבחירה הזו נושכת בפעם הראשונה.

## הגשה

MR #1. המנטור סוקר לפי מחוון שלב-1.

## הגדרת סיום

- דמו על מכשיר היעד, **כולל kill-and-relaunch** עם auto-login.
- הטסטים ירוקים.
- ה-MR מוזג.

## למעבר הלאה

המשיכו אל [שלב 2 — מפה עם Skyline](/alpha-onboarding/final-project/map-skyline/) — השלב הקשה והכי אלפא-רלוונטי.

