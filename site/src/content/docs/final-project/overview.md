---
title: "פרויקט הסיום — «תרגול»"
---

זהו פרויקט הגמר: אפליקציית אנדרואיד שתבנו ביד, בארכיטקטורה של הצוות, מול ה-backend שכבר בניתם בשלב 1. כאן כל מה שלמדתם הופך ל-feature אמיתי. המסמך הזה הוא מפרט המוצר וכללי העבודה — קראו אותו בתחילת שלב פרויקט הגמר (יום 11), אבל שימו לב: **חלק ה-backend כבר נבנה בימים 3–4**; כאן רק נחבר אליו.

> «תרגול» הוא שם עבודה. אפשר לטייח את הקופי, אבל לא את המכניקה, הישויות, או חוזה ה-API — אלה מחייבים.

## המוצר

יחידות ברחבי הארץ מתאמנות ב**שטחי אימון** — מטווחים, שטחי אימון פתוחים, ומתקנים סגורים. האפליקציה מציגה את השטחים על **מפה תלת-ממדית**, מאפשרת לחייל **לתעד תרגול** בשטח, ו**לעיין בהיסטוריה**. הצורה הזו מהדהדת בכוונה את אלפא עצמה: ישויות על מפה + bottom-sheet עם פרטים + דיווחים. הכל גנרי ולא מסווג.

## הישויות

**`TrainingArea`** — שטח אימון:

| שדה | טיפוס | הערה |
|---|---|---|
| `id` | String | מזהה |
| `name` | String | שם השטח |
| `type` | enum | מטווח / שטח אימון פתוח / מתקן סגור |
| `coordinates` | { lat, lon } | נקודה על המפה |
| `capacity` | Int | קיבולת |
| `status` | enum | פנוי / תפוס / בשיפוץ |

**`Exercise`** — תרגול:

| שדה | טיפוס | הערה |
|---|---|---|
| `id` | String | מזהה |
| `trainingAreaId` | String | לאיזה שטח |
| `userId` | String | מי תיעד |
| `date` | Date | מתי |
| `type` | String | סוג התרגול |
| `durationMinutes` | Int | משך בדקות |
| `rating` | Int | דירוג 1–5 |
| `freeNotes` | String | הערות חופשי |

## הארכיטקטורה הנדרשת

```text
Compose UI ──► ViewModel ──► Repository ──► ApiClient (OkHttp + kotlinx.serialization)
 (stateless)   (interface+Impl,   (interface+Impl)        └─► DataStore (token)
               StateFlow<ScreenState>)
        ▲                                  Koin מחווט הכל; ניווט דרך sealed Route; טסטים לכל feature
```

**הפרויקט נבדק מול [MVVM ו-Koin](/alpha-onboarding/foundations/mvvm-koin/).** כל הפרות התבנית שם נספרות כאן.

## שלבי הבנייה

| שלב | ימים (core / fast) | מסמך | תוצר |
|---|---|---|---|
| Backend | 2 (נעשה בשלב 1) | [backend עם agent](/alpha-onboarding/final-project/backend/) | שרת רץ + seed |
| התחברות | 3 / 3 | [שלב 1](/alpha-onboarding/final-project/login/) | MR #1 |
| מפה עם Skyline | 5 / 4 | [שלב 2](/alpha-onboarding/final-project/map-skyline/) | MR #2 |
| תיעוד והיסטוריה | 4 / 2–3 | [שלב 3](/alpha-onboarding/final-project/logging-history/) | MR #3 → שער 2 |
| הרחבות | אופציונלי | [הרחבות](/alpha-onboarding/final-project/extensions/) | לפי בחירה |

כל שלב נגמר ב-MR שהמנטור סוקר **לפני** שמתחילים את הבא. ה-MRים צריכים להיות קטנים מספיק לסקירה תוך פחות מ-30 דקות — וזה גשר לנורמת הצוות: גודל ה-MR נבדק אוטומטית ב-CI בריפו האמיתי (`check-pr-size.sh`).

## כללי AI בפרויקט הגמר

[סולם המצבים](/alpha-onboarding/working-with-ai/principles/#סולם-המצבים) חל במלואו: Explainer ו-Navigator תמיד; **Generator** לפי החלטת המנטור בשער 1, ו**לעולם לא** עבור קוד ה-wrapper של TerraExplorer (ראו [שלב המפה](/alpha-onboarding/final-project/map-skyline/) למה).

## אם אתם שניים

אותו מפרט, נבנה באופן עצמאי. לפני שהמנטור סוקר, **אתם סוקרים זה את ה-MR של זה** (הסוקר מתחלף). אל תשתפו קוד — כן שתפו סיפורי-מלחמה של דיבוג. הסקירה ההדדית היא חלק מהלמידה.

## הגדרת סיום (שער 2)

- כל שלושת MR-השלבים מוזגו.
- דמו של האפליקציה: התחברות → מפה → הקשה על שטח → תיעוד תרגול → צפייה בהיסטוריה.
- הטסטים ירוקים.
- מחוון המנטור ([מחווני הערכה](/alpha-onboarding/mentor/rubrics/)) מסופק.

## למעבר הלאה

מתחילים לבנות. עברו אל [שלב 1 — התחברות](/alpha-onboarding/final-project/login/). (שלב ה-backend הושלם בשלב 1; ה[מסמך שלו](/alpha-onboarding/final-project/backend/) זמין לעיון.)

