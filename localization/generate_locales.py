#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates the locales files for EEG-101, using the information from the CSV file
'translation_text_file'

@author: Raymundo Cassani raymundo.cassani@gmail.com
"""

import csv
import numpy as np
import os

# CSV files with labels for different languages
translation_text_file = 'translation_text.csv'

# Get path to i18n folder in src
dir = os.path.dirname(__file__)
i18n_dir = os.path.join(dir, '..', 'EEG101', 'src', 'i18n', 'locales')

# Delete existing translation files
[os.remove(os.path.join(i18n_dir, f)) for f in os.listdir(i18n_dir) if f.endswith(".js")]

with open(translation_text_file, newline='') as csvfile:
    text_array = np.array(list(csv.reader(csvfile)))

languages = text_array[0 , 1::]
keys = text_array[1:: , 0]

# create a 'language.js' locale file for each language in the CSV'
for language in languages:
    # find index of a given language
    language_ix = list(languages).index(language) + 1
    language_labels = text_array[1:: , language_ix]

    # create locale file
    locale_file = open(language + '.js', 'w' , newline='\n')
    locale_file.write('export default { \n')

    for key, label in zip(keys, language_labels):
        if key.startswith('//'):
            # key is a comment
            locale_file.write('\t' + key + '\n')
        elif not key:
            # keys is empty
            locale_file.write('\n')
        else:
            locale_file.write('\t' + key + ':  ' + "'" + label + "'" + ',\n')

    locale_file.write('};')

# Copy all the new translation files to the i18n directory
[os.rename(f, os.path.join(i18n_dir, f)) for f in os.listdir() if f.endswith('.js')]
