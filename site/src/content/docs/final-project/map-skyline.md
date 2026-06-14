---
title: "שלב 2 — מפה עם Skyline"
---

זהו השלב הקשה והכי אלפא-רלוונטי (ימים 14–18). תעלו את **TerraExplorer** — ה-SDK האמיתי של המפה של הצוות — בתוך האפליקציה שלכם, ותכתבו לו wrapper דק משלכם. כל העובדות הטכניות כאן מאומתות מול alpha-mobile; אל תרככו אותן.

## הקשר

אלפא היא, בלבה, אפליקציית מפה — וה-SDK הזה הוא לחם-החוק היומי של הצוות. השלב הזה הוא גם **השיעור החשוב ביותר בתוכנית על עבודה עם AI** (ראו את הקופסה למטה).

## השגת ה-SDK

ה-SDK הוא AAR שמגיע מוטמע (vendored). מתוך ה-clone של alpha-mobile:

1. העתיקו את `map/terraexplorer/libs/TerraExplorerAndroidModule.aar` (כ-53MB) אל `app/libs/` בפרויקט פרויקט הגמר.
2. ב-Gradle:
   ```kotlin
   implementation(files("libs/TerraExplorerAndroidModule.aar"))
   ```
3. העתיקו את נכסי השטח `Default.fly` ו-`Default_Local_Terrain.mpt` מ-`map/terraexplorer/src/main/assets/` אל ה-assets שלכם.

אין קריאת license, אין חשבון, הכל offline. ה-AAR כבר committed בריפו הפתוח — אין חשיפה חדשה.

> **בינארי גדול:** אם ריפו פרויקט הגמר על GitHub, אפשר פשוט ל-commit אותו (מתחת ל-100MB זה תקין) או להשתמש ב-Git LFS.

## אתחול

זו רצף-האתחול כפי שמתואר ב-`map/terraexplorer/src/main/java/com/even/map/terraexplorer/functions/InitMapView.kt` — **התאימו, אל תעתיקו-הדביקו**; הקובץ פתוח מולכם:

```text
TEApp.setMainActivityContext(activity)
TEApp.setApplicationContext(activity.applicationContext)
CoreServices.Init(activity)
  → רושמים BroadcastReceiver ל-TEGLRenderer.ENGINE_INITIALIZED
  → כשמתקבל: פותחים את הפרויקט (.fly), ואז מוסיפים שכבות
```

ה-view הוא **`TEView`**, ומארחים אותו ב-Compose דרך `AndroidView { }`.

> **התבנית ההיברידית:** המפה היא אי של `AndroidView` בתוך עץ Compose — בדיוק כפי שהאפליקציה האמיתית עושה ("TerraExplorer AndroidView + Compose overlay", מההחלטות הארכיטקטוניות ב-`CLAUDE.md`). כל ה-UI סביב המפה הוא Compose; המפה עצמה היא אי נפרד.

## ה-wrapper הדק שלכם

זו המשימה האמיתית: **interface בסגנון `MapController` משלכם**, עם 4 פעולות —

1. `initialize(...)`
2. `flyTo(lat, lon, alt)`
3. `showTrainingAreas(areas)` — feature layer או pins פשוטים
4. `setOnAreaTapListener(callback)`

— ועוד `Impl` שמסתיר **כל** טיפוס של ה-SDK.

> **כלל ברזל:** שום קוד מעל ה-wrapper לא יִיבא `com.skyline.*`. למה? כי זו בדיוק הסיבה ש-alpha-mobile מחזיקה את `map/src/main/java/com/even/map/MapController.kt` + תיקיית `wrappers/` — אחרי שתכתבו wrapper משלכם, שכבת ה-wrapper של הצוות תיקרא לכם מוכרת. הצפון שלכם: `MapController.kt` (ה-interface), `TerraExplorerController.kt` (ה-Impl), ותיקיות `wrappers/` ו-`functions/`. **למדו אותן, אל תעתיקו.**

## הפיצ'ר

- טענו שטחים מ-`GET /training-areas`.
- רנדרו אותם על המפה.
- הקשה על שטח → `ModalBottomSheet` עם פרטי השטח + כפתור "טוס לכאן" (fly-to).
- אייקון הגדרות מעל המפה → מסך פשוט עם logout (סוגר את הלולאה משלב 1).

ה-state לפי תבנית הצוות; המפה נשארת אי של `AndroidView`, כל השאר Compose.

## שיעור ה-AI

> **🧠 קופסה — קראו את זה לאט:**
> **ה-AI לא מכיר את ה-SDK הזה.** התיעוד הציבורי דליל, נתוני האימון ≈ אפס, וה-Generation **ימציא** APIs של TerraExplorer שנראים אמינים לחלוטין ואינם קיימים.
>
> בשלב הזה אתם עובדים כמו שהצוות עובד על טכנולוגיה נישתית:
> - **Explainer** מעל קוד ה-wrappers של alpha-mobile ("הסבר לי מה הקובץ הזה עושה").
> - **decompiler / autocomplete** של ה-IDE על ה-AAR כדי לגלות APIs אמיתיים.
> - **ניסויים שלכם.**
>
> **מצב Generator אסור לקוד wrapper בשלב הזה** — לא כעונש, אלא כי הוא באמת לא עובד. אמתו בעצמכם: הקדישו 15 דקות (detour מאושר) לבקש מה-AI לכתוב את האתחול, וספרו כמה מתודות הוא המציא. זה מחסן טוב יותר מכל הרצאה.

## תקלות צפויות

> - **engine-init race** — הוספת שכבות לפני ש-`ENGINE_INITIALIZED` נורה. זו התקלה מספר 1; הקפידו להוסיף שכבות רק בתוך ה-receiver.
> - **נתיבי assets שגויים** — ודאו שה-`.fly` וה-`.mpt` באמת ב-assets ושהשם תואם.
> - **כיוונון פרמטרים** — alpha-mobile מגדירה פרמטרים כמו `HOLD_GESTURE_THRESHOLD_MS=500` דרך `SetParam` ב-`InitMapView.kt`. זה הסוג של כיוונון שתפגשו; לא חובה עכשיו, אבל דעו שהוא קיים.
>
> **אם אתה על אמולטור:** אמולציית GL/GPU היא החשוד מספר 1 לגלובוס שחור/ריק. נסו image אחר, אכפו hardware GL, או עברו למכשיר פיזי — GPU אמיתי עוקף את כל מחלקת הבעיות הזו.
> **אם אתה על מכשיר פיזי:** בעיות GL נדירות; חשדו קודם ב-assets ובסדר האתחול.

## נפילת מנטור (גלוי גם לכם)

אם ההקמה נלחמת בכם יותר מיום, **המנטור מוסר לכם את קטע האתחול העובד** ואתם ממשיכים ל-wrapper. לוח הזמנים חשוב יותר מהסבל.

## הגשה

MR #2 (שקלו לפצל: אתחול+wrapper, ואז ה-feature).

**הגדרת סיום:**
- הגלובוס מתרנדר.
- השטחים נראים על המפה.
- הקשה → bottom sheet → fly-to עובד.
- אין import של `com.skyline.*` מעל ה-wrapper.
- אתם יכולים לשרטט מהזיכרון את השכבות `MapController` → `TerraExplorerController` → `wrappers/` של alpha-mobile.

## למעבר הלאה

המשיכו אל [שלב 3 — תיעוד והיסטוריה](/alpha-onboarding/final-project/logging-history/) — עבודת feature מלאה במהירות, השלב שהכי דומה לטיקט אלפא אמיתי.

