---
title: "Coroutines ו-Flow — הדלתא הגדולה"
---

זה הפער המנטלי הגדול ביותר מעולם ה-JavaScript, ולכן ניקח אותו לאט וקונקרטי. כמעט כל ה-state באלפא יושב על `StateFlow`; אם המסמך הזה נוחת אפילו חצי, ה-MVVM בהמשך ייראה הגיוני במקום קסום. בסוף תוכלו לכתוב קוד אסינכרוני ב-Kotlin, ולענות לשאלה אחת על כל coroutine שאתם משיקים: **מי מבטל אותה, ומתי.**

## למה זה לא async/await עם שם אחר

ההבדל המהותי הוא **structured concurrency**:

| JavaScript | Kotlin coroutines |
|---|---|
| thread יחיד + event loop | concurrency מובנה, עם בעלוּת |
| Promise הוא **eager** — מתחיל לרוץ מיד | coroutine רצה בתוך **scope** שמחזיק בה |
| Promise הוא **unowned** — אף אחד לא "אחראי" עליו | לכל coroutine יש בעלים; ביטול מתפשט במורד העץ |
| לזרוק promise ולשכוח = בסדר | לזרוק coroutine ולשכוח = דליפה |

האינסטינקט מ-JS — "תשיק promise, תעשה לו await אחר כך" — מייצר כאן דליפות. ב-Kotlin כל coroutine חיה בתוך scope, וכשה-scope מת, כל הילדים שלו מבוטלים אוטומטית. זו לא הגבלה — זו רשת ביטחון.

## suspend

פונקציית `suspend` היא פונקציה שיכולה **להשהות את עצמה בלי לחסום thread**. בזמן ההשהיה (למשל המתנה לרשת), ה-thread משוחרר לעבודה אחרת, וכשהתוצאה מוכנה הפונקציה ממשיכה מאותה נקודה.

```kotlin
// Kotlin
suspend fun loadUser(id: String): User { ... }

// TypeScript המקביל
async function loadUser(id: string): Promise<User> { ... }
```

ההבדל בקריאה: ל-`suspend fun` קוראים **רק** מתוך coroutine אחרת או מתוך `suspend fun` אחרת. אין `.then()` ואין `await` — פשוט קוראים לה, והיא נראית סינכרונית אבל לא חוסמת:

```kotlin
val user = loadUser(id)   // נראה סינכרוני, לא חוסם thread
```

## scopes ומבנה

`CoroutineScope` הוא הבעלים. ה-scope שתשתמשו בו בפועל כמעט תמיד הוא **`viewModelScope`**:

```kotlin
viewModelScope.launch {
    val user = loadUser(id)
    _state.update { it.copy(name = user.name) }
}
```

> **גשר:** ב-React כתבתם ידנית את ה-cleanup של ה-effect (להחזיר פונקציה מ-`useEffect` שמבטלת בקשה כשהקומפוננטה יורדת). כאן ה-scope עושה את זה בשבילכם: כשה-ViewModel נהרס, `viewModelScope` מבטל את כל ה-coroutines שלו. אין דליפה ידנית לנהל.

- `launch` — "fire and structured-forget": משיק coroutine, מחזיר `Job`. לעבודה שלא מחזירה ערך.
- `async` / `await` — משיק coroutine שמחזיר `Deferred<T>`; `await()` מחכה לתוצאה. לעבודה מקבילית שמחזירה ערך.

```kotlin
val a = async { loadA() }
val b = async { loadB() }
val combined = a.await() + b.await()   // A ו-B רצו במקביל
```

**ביטול מתפשט:** אם תבטלו (או תיכשל) coroutine-אב, כל הילדים מבוטלים. הביטול הוא **שיתופי** — קוד שמחשב הרבה צריך לבדוק `isActive` או לקרוא ל-`suspend` שמכבדת ביטול.

> **למה `GlobalScope` אסור בקוד שלנו:** coroutine ב-`GlobalScope` אינה בבעלות אף אחד — היא שורדת את ה-ViewModel, ממשיכה לרוץ אחרי שהמסך ירד, ודולפת. זה בדיוק מה ש-structured concurrency בא למנוע.

## dispatchers

`Dispatcher` קובע על איזה thread ה-coroutine רצה:

- **`Main`** — ה-UI thread. עדכוני state ו-UI כאן.
- **`IO`** — לפעולות חוסמות (רשת, דיסק).
- **`Default`** — לחישובים כבדים (CPU).

מעבירים thread עם `withContext`:

```kotlin
val data = withContext(dispatchers.io) { readBigFile() }  // רץ על IO, חוזר ל-caller
```

> **גשר:** ה-Main thread הוא ה-UI thread — חסימה שלו = jank (מסך תקוע). בדפדפן לא הייתה לכם הבחירה הזו לעשות; כאן צריך להחליט במודע איפה כל פעולה רצה. (בקוד של הצוות מזריקים `DispatchersProvider` במקום לקרוא ל-`Dispatchers.IO` ישירות — כדי שאפשר יהיה להחליף אותם בטסטים.)

## Flow

`Flow<T>` הוא **stream קר** — תחשבו עליו כעל async generator, או Observable מינימלי:

```kotlin
val ticker: Flow<Int> = flow {
    var i = 0
    while (true) { emit(i++); delay(1000) }
}
```

האופרטורים מוכרים לכם בשם מהמערכים / מ-RxJS: `map`, `filter`, `take`, ועוד. `collect` = subscribe:

```kotlin
ticker.map { it * 2 }.filter { it > 4 }.take(3).collect { println(it) }
```

> **חזרה על החוזה eager/lazy:** Flow לא עושה כלום עד שעושים לו `collect` (קר/lazy) — בניגוד ל-Promise שמתחיל לרוץ ברגע שנוצר (eager). זו אותה הבחנה מתחילת המסמך, עכשיו על streams.

## StateFlow ו-SharedFlow

אלה flows **חמים** — קיימים ופעילים ללא תלות במי שמאזין.

- **`StateFlow<T>`** — מחזיק תמיד ערך נוכחי אחד. תחשבו עליו כ-**`useState` שחי מחוץ לקומפוננטה ושורד recomposition וסיבוב מסך**. יש לו `.value`, ו-Compose צורך אותו דרך `collectAsState()` (הסיפור המלא ב[מסמך ה-Compose](/alpha-onboarding/foundations/compose/)).
- **`SharedFlow<T>`** — לאירועים חד-פעמיים (snackbar, ניווט) שאין להם "ערך נוכחי".

תבנית הצוות (כלל קשיח מ-`CLAUDE.md`): ה-`MutableStateFlow` פרטי, וחושפים החוצה `StateFlow` בלבד —

```kotlin
private val _state = MutableStateFlow(ScreenState())
val state: StateFlow<ScreenState> = _state          // immutable כלפי חוץ

fun onClick() = _state.update { it.copy(count = it.count + 1) }
```

> **לעולם אל תחשפו `MutableStateFlow` מתוך ViewModel.** זה לא סגנון — זה כלל. מי שמחוץ ל-ViewModel קורא state, אף פעם לא כותב אותו ישירות.

## runTest

טסטים אסינכרוניים משתמשים ב-`kotlinx-coroutines-test`: עוטפים ב-`runTest`, ומקפיצים את הזמן הווירטואלי עם `advanceUntilIdle()`:

```kotlin
@Test
fun example() = runTest {
    vm.onInputTextChange("ss")        // משיק עבודה עם debounce
    advanceUntilIdle()                // "מריץ" את כל הזמן התלוי
    assertIs<Loaded>(vm.state.value.searchMode)
}
```

זו רק הצורה — הטסטינג המלא מגיע ב[תרגיל ה-MVVM](/alpha-onboarding/foundations/mvvm-koin/). דוגמה אמיתית: `app/src/test/java/com/even/alpha/test/core/ui/search/SearchViewModelTest.kt`.

## קריאת חובה

- [Coroutines basics](https://kotlinlang.org/docs/coroutines-basics.html), [Cancellation and timeouts](https://kotlinlang.org/docs/cancellation-and-timeouts.html), ו-[Asynchronous Flow](https://kotlinlang.org/docs/flow.html) ב-kotlinlang.org.
- [StateFlow and SharedFlow](https://developer.android.com/kotlin/flow/stateflow-and-sharedflow) ב-developer.android.com.

## תרגילים

**א. concurrency וביטול (קובץ scratch של JVM):**
כתבו `suspend fun` ש"שולפת" שני משאבים מדומים במקביל (`async`) ומשלבת אותם. עטפו ב-`withTimeout(2000)` והדפיסו הוכחה שהביטול התפשט (למשל הדפסה בתוך `finally` או תפיסת `CancellationException`).

**ב. Flow:**
בנו `Flow<Int>` מסוג ticker, הפעילו עליו `map` + `filter`, ואספו אותו לתוך `MutableStateFlow`. אמתו את הערך האחרון. אחר כך הסבירו (לחופף, או בהערה) **למה `StateFlow` השמיט ערכי ביניים** — זהו רמז: conflation. זו נקודת ה-aha של המסמך.

**הגדרת סיום:** שני התרגילים רצים, ואתם יכולים לענות "מי מבטל את הקורוטינה הזו ומתי" על כל coroutine שהשקתם.

## למעבר הלאה

המשיכו אל [יסודות Android](/alpha-onboarding/foundations/android/) — מינימום ההיכרות עם הפלטפורמה שמפתח אלפא באמת נוגע בו.

