

# Libmuse
-keep  class com.choosemuse.libmuse.* { *; }

# AndroidPlot
-keep class com.androidplot.** { *; }

# Animated Gif support
-keep, includedescriptorclasses class com.facebook.imagepipeline.** { *; }
-dontwarn com.facebook.imagepipeline.**

# Svg
-keep class com.horcrux.svg.** { *; }

# JTransforms
-dontwarn org.apache.commons.**
-dontwarn pl.edu.icm.jlargearrays.**

# DSP
-dontwarn biz.source_code.**
-dontwarn javax.**





