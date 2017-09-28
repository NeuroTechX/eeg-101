# Localization

This document describes how to add support for a new language in EEG 101.

## 1. Translate the content

Add a new column to `/localization/translation_text.csv` for the language you are translating to (the use of a spreadsheet editor such as LibreOffice Calc or Excel is recommended).

Then, translate each row from the English version (first column) to the new language, and add the translated text to the CSV file, in the respective column.

### Tips

* ...

### Some content cannot currently be translated using that CSV file

* Awake/asleep animation
* Neuron diagram
* Labels of graphs

## 2. Generate the locale files for all languages

Run the Python 3 script `/localization/generate_locales.py` to generate the locale files:

```
>>> python generate_locales.py
```

This creates files in the `localization/` directory with name `<language key>.js`. These files contain the translations, ready to be incorporated into the app.

## 3. Test to make sure the translation works in the app

Due to the layout and formatting of the app in its original English version, your translation might not work well in practice once it's incorporated in the app. Text boxes, dynamic UI elements and general formatting might look awkward.

Eventually, most of this testing should be automated.
