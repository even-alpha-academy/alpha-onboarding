---
title: "Claude Code — מסלול בתשלום"
---

נספח למי שיש לו (או לצוות שלו) מנוי Claude — הכלי שצוות אלפא עצמו עובד איתו. החוזה זהה ל[מסמך העקרונות](/alpha-onboarding/working-with-ai/principles/); כאן נתמקד במה ש-Claude Code מוסיף. אם אתם על המסלול החינמי, חזרו ל[כלים חינמיים](/alpha-onboarding/working-with-ai/free-tools/).

## למה הצוות עובד עם זה

alpha-mobile מגיע עם `CLAUDE.md` מתוחזק, והכלי קורא ומכבד אותו. ללמוד את זרימת ה-AI של הצוות היא חלק מהחפיפה עצמה — כשתעבדו על הקוד האמיתי, זו הסביבה שתפגשו.

## התקנה והתחברות

- התקינו את ה-CLI והתחברו לפי [התיעוד הרשמי של Claude Code](https://docs.claude.com/en/docs/claude-code). הכלי עובד בטרמינל, כתוסף ל-IDE (VS Code, JetBrains/Android Studio), וכאפליקציית דסקטופ.
- ההוראות המדויקות משתנות מדי פעם — הסתמכו על עמוד התיעוד הרשמי, לא על מספרי גרסה ספציפיים.

## מושגי ליבה במונחי הסולם

- **`CLAUDE.md`** — בדיוק קובץ הקונטקסט ממסמך העקרונות, נתמך באופן native. ל-alpha-mobile כבר יש כזה; קראו אותו דרך הכלי: *"explain this project's conventions."*
- **Plan mode** — Navigator עם חגורת בטיחות: הכלי מציע תוכנית שאתם מאשרים לפני כל עריכה. זו ברירת המחדל המומלצת לחניכים במהלך פרויקט הגמר.
- **Permission prompts** — שער ה-review: אל תאשרו אוטומטית שום דבר שלא הייתם מאשרים ב-MR.
- **Slash commands / skills** — קיימים (למשל code review). דעו שהם שם, והפנו לתיעוד; אין צורך ללמוד את כולם עכשיו.

## דפוסי עבודה מומלצים לחניך

- **התחילו session עם משימה תחומה** (לפי [תיחום משימות](/alpha-onboarding/working-with-ai/principles/#תיחום-משימות)) — לא "תבנה את ה-feature".
- **השתמשו ב-plan mode** לכל דבר רב-קבצי.
- **בקשו מהכלי להסביר את ה-diff שלו** לפני שאתם מקבלים — אם ההסבר לא מחזיק, ה-diff לא מוכן.
- **בשלב TerraExplorer/Skyline** ציפו ל-Generation חלש (לפי [סעיף "מתי לא להאציל"](/alpha-onboarding/working-with-ai/principles/#מתי-לא-להאציל)), והשתמשו בכלי כ-Explainer מעל קוד ה-wrappers של alpha-mobile.

## תרגיל

פתחו את alpha-mobile עם הכלי, ובקשו סיור מודרך ב-`app/src/main/java/com/even/alpha/feature/settings/` (ה-exemplar של MVVM). אחר כך אמתו את טענות הסיור מול הקבצים עצמם (`SettingsViewModel.kt`, `SettingsScreen.kt`). **הגדרת סיום:** כמו בתרגיל העקרונות — מצאתם ורשמתם לפחות אי-דיוק אחד.

## למעבר הלאה

עברו אל [בניית ה-backend עם agent](/alpha-onboarding/final-project/backend/) — ארגז החול המפוקח של מצב Generator.

