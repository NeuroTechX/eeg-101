import java.util.Arrays;
import org.apache.commons.lang3.ArrayUtils;
import java.util.stream.*;

//
// TODO:
// - Continue implementing the partial_fit method
// - Implement subfunctions (unique, count, etc.)
//   -> Currently having problems using LinkedHashSet
//

public class GaussianNaiveBayesClassifier {

	boolean fitted;

	private int[] classes;
	private int nbClasses;
	private int nbFeats;

	private int[] classCounts;
	private double[][] sum;
	private double[][] sumSquares;

	private double[] classPriors;

	public GaussianNaiveBayesClassifier() {
		// Gaussian Naive Bayes classifier
		//
		// Attributes:
		// 	fitted (bool): True if the model has been fitted
		// 	classes (int[]): int identifier for each class
		//  nbClasses (int): number of classes for which the model
		//  	has been trained
		// 	nbFeats (int): number of features
		//  classCounts (int[]): number of examples by class seen
		//  CONTINUE DESCRIPTION HERE!
		//

		fitted = false;

	}

	// public void fit(double[][] X, int[] y) {
	// 	// Fit a Gaussian Naive Bayes model
	// 	//
	// 	// Args:
	// 	// 	X: training data, [nb examples, nb features]
	// 	//  y: labels [nb examples]
 //  		//
 //  		// Note: Calling `fit()` overwrites previous information. Use `partial_fit()`
 // 		//  to update the model with new training data.

	// 	fitted = false; // if model has already been trained, re-initialize parameters
	// 	partial_fit(X,y);
	// }

	// public void partialFit(double[][] X, int[] y) {
	// 	// Fit or update the GNB model
	// 	//
	// 	// Args:
	// 	// 	X: training data, [nb examples, nb features]
	// 	//  y: labels [nb examples]
	// 	//
	// 	// Using `partialFit()` allows to update the model given new data.

	// 	if (!fitted) { // model has not been trained yet, initialize parameters
	// 		classes = unique(y);
	// 		nbClasses = classes.length;
	// 		nbFeats = X[0].length;

	// 		classCounts = new int[nbClasses];
	// 		sum = new double[nbClasses][nbFeats];
	// 		sumSquares = new double[nbClasses][nbFeats];
	// 	}

	// 	// Update class priors
	// 	int[] newClassCounts = count(y,classes);
	// 	for (int i = 0; i < nbClasses; i++) {
	// 		classCounts[i] += newClassCounts[i];
	// 	}
	// 	int nbExamplesSeen =  IntStream.of(classCounts).sum();
	// 	for (int i = 0; i < nbClasses; i++) {
	// 		classPriors[i] = classCounts[i]/nbExamplesSeen;
	// 	}

	// 	// Update sum and mean
	// 	sum = ...

	// 	// CONTINUE HERE!!!
	// 	// TODO:
	// 	// - The update can probably be done by first counting and summing
	// 	//   the occurences of each class in X
	// 	// - 



	// 	// Update sum of squares and variance
	// 	// ...

	// 	fitted = true;

	// }

	public int[] predict(double[][] X) {
		// ...
	}

	public float[] predictProba(double[][] X) {
		// ...
	}

	public float score(double[][] X, double[] y) {
		// ...
	}

	public float[][] getMeans() {
		// ...
	}

	public float[][] getVariances() {
		// ...
	}

	public float[][] getClassPriors() {
		// ...
	}

	public void setMeans() {
		// ...
	}

	public void setVariances() {
		// ...
	}

	public void setClassPriors() {
		// ...
	}

	public double[][] decisionBoundary() {
		// ...
	}

	private double[][] gaussian(double[][] X, double[] mu, double[] var) {
		// ...
	}

	private int[] unique(int[] numbers) {
		// Find unique elements in array
		//
		// Args:
		// 	x: array for which to find unique values
		//
		// Returns:
		// 	array containing unique values
		//
		// Taken from http://stackoverflow.com/a/15752202

		Set<Integer> setUniqueNumbers = new LinkedHashSet<Integer>();
		for (int x : numbers) {
		    setUniqueNumbers.add(x);
		}

		int[] uniqueNumbers = new int[setUniqueNumbers.length];
		for (int i = 0; i < setUniqueNumbers.length; i++) {
			uniqueNumbers[i] = setUniqueNumbers[i];
		}

		return uniqueNumbers;
	}

	// private int[] count(int[] numbers, int[] like) {
	// 	// Count the number of occurences of a specific value in an array
	// 	//
	// 	// Args:
	// 	// 	numbers: list of integers in which to look for 
	// 	// 	like: integers to look for
	// 	//
	// 	// Returns:
	// 	// 	number of occurences for each desired element
	// 	//
	// 	// TODO: THIS FUNCTION WILL NOT WORK AS IS! FIX IT!

	// 	HashMap<Integer, Integer> repetitions = new HashMap<Integer, Integer>();

	//  	for (int i = 0; i < numbers.length; ++i) {
	// 		int item = numbers[i];

	// 		if (repetitions.containsKey(item))
	// 	    	repetitions.put(item, repetitions.get(item) + 1);
	// 		else
	// 	    	repetitions.put(item, 1);
	// 	}
	// }

	public static void main(String[] args) {

		GaussianNaiveBayesClassifier clf = new GaussianNaiveBayesClassifier();

		// Test unique() method


	}
}