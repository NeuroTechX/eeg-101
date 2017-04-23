import java.util.Arrays;
import java.util.*;
import java.util.stream.*;

//
// TODO:
// - Continue implementing the partial_fit method
//

public class GaussianNaiveBayesClassifier {

	boolean fitted;

	private int[] classes;
	private int nbClasses;
	private int nbFeats;

	private int[] classCounts;
	private double[][] sum;
	private double[][] sumSquares;
	private double[][] theta;
	private double[][] sigma;

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

	public void fit(double[][] X, int[] y) {
		// Fit a Gaussian Naive Bayes model
		//
		// Args:
		// 	X: training data, [nb examples, nb features]
		//  y: labels [nb examples]
  		//
  		// Note: Calling `fit()` overwrites previous information. Use `partial_fit()`
 		//  to update the model with new training data.

		fitted = false; // if model has already been trained, re-initialize parameters
		partial_fit(X,y);
	}

	public void partialFit(double[][] X, int[] y) {
		// Fit or update the GNB model
		//
		// Args:
		// 	X: training data, [nb examples, nb features]
		//  y: labels [nb examples]
		//
		// Using `partialFit()` allows to update the model given new data.

		if (!fitted) { // model has not been trained yet, initialize parameters
			classes = unique(y);
			nbClasses = classes.length;
			nbFeats = X[0].length;

			classCounts = new int[nbClasses];
			classPriors = new double[nbClasses];
			sum = new double[nbClasses][nbFeats];
			sumSquares = new double[nbClasses][nbFeats];
			theta = new double[nbClasses][nbFeats];
			sigma = new double[nbClasses][nbFeats];
		}

		int[] newClassCounts = count(y,classes);

		// Class count, sum, theta, sum of squares and sigma can all be computed per class
		for (int i = 0; i < nbClasses; i++) {
			classCounts[i] += newClassCounts[i];

			for (int k = 0; k < nbFeats; k++) {
				// Update sum and sum of squares
				for (int j = 0; j < X.length; j++) {
					if (y[j] == classes[i]) {
						sum[i][k] += X[j][k];
						sumSquares[i][k] += X[j][k] * X[j][k];
					}
				}
				// Update theta and sigma 
				theta[i][k] = sum[i][k] / classCounts[i];
				sigma[i][k] = sumSquares[i][k] / classCounts[i] - theta[i][k] * theta[i][k];
			}
		}

		// Update class priors
		int nbExamplesSeen =  IntStream.of(classCounts).sum();
		for (int i = 0; i < nbClasses; i++) {
			classPriors[i] = (double) classCounts[i]/nbExamplesSeen;
		}

		fitted = true;
	}

	// public int[] predict(double[][] X) {
	// 	// ...
	// }

	// public float[] predictProba(double[][] X) {
	// 	// ...
	// }

	// public float score(double[][] X, double[] y) {
	// 	// ...
	// }

	// public float[][] getMeans() {
	// 	// ...
	// }

	// public float[][] getVariances() {
	// 	// ...
	// }

	// public float[][] getClassPriors() {
	// 	// ...
	// }

	// public void setMeans() {
	// 	// ...
	// }

	// public void setVariances() {
	// 	// ...
	// }

	// public void setClassPriors() {
	// 	// ...
	// }

	// public double[][] decisionBoundary() {
	// 	// ...
	// }

	// private double[][] gaussian(double[][] X, double[] mu, double[] var) {
	// 	// ...
	// }

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
		for(int x : numbers) {
		    setUniqueNumbers.add(x);
		}

		int[] uniqueNumbers = new int[setUniqueNumbers.size()];
		Iterator<Integer> itr = setUniqueNumbers.iterator();
		int i = 0;
		while(itr.hasNext()){
			uniqueNumbers[i] = itr.next();
            i++;
        }

		return uniqueNumbers;
	}

	public int[] count(int[] numbers, int[] like) {
		// Count the number of occurences of a specific value in an array
		//
		// Args:
		// 	numbers: list of integers in which to look for 
		// 	like: integers to look for
		//
		// Returns:
		// 	number of occurences for each desired element
		//
		// TODO: Make a more efficient version

		int[] counts = new int[like.length];
		for (int i :like){
			for (int j : numbers) {
			   if (i == j){
			   		counts[i]++;
			   }
			}
		}

		return counts;
	}

	public void print() {
		// Print the current state of the model
		System.out.println("Classes: "+Arrays.toString(classes));
		System.out.println("Number of classes: "+nbClasses);
		System.out.println("Number of features: "+nbFeats);
		System.out.println("Class counts: "+Arrays.toString(classCounts));
		System.out.println("Class priors: "+Arrays.toString(classPriors));
		System.out.println("Sums: "+Arrays.deepToString(sum));
		System.out.println("Sums of squares: "+Arrays.deepToString(sumSquares));
	}

	public static void main(String[] args) {

		GaussianNaiveBayesClassifier clf = new GaussianNaiveBayesClassifier();

		// Test unique() method
		double[][] X = new double[][]{{1, 2},
									  {3, 4},
									  {5, 6},
									  {7, 8}};
		int[] y = {0, 0, 0, 1};

		clf.partialFit(X, y);

		clf.print();
	}
}