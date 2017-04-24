import java.util.Arrays;
import java.util.*;
import java.util.stream.*;

//
// TODO:
// 1. Implement predictProba
// 2. Implement decision boundary method
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
		partialFit(X,y);
	}

	public void partialFit(double[][] X, int[] y) {
		// Fit or update the GNB model
		//
		// Args:
		// 	X: training data, [nb examples, nb features]
		//  y: labels [nb examples]
		//
		// Using `partialFit()` allows to update the model given new data.

		assert (X.length == y.length) : "X and y must contain the same number of examples.";

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

	public double[][] predictProba(double[][] X) {
		// Evaluate the posterior for each class one by one

	// 	double[][] prob = new double[nbClasses][X.length];
	// 	for (int i = 0; i < nbClasses; i++) {
	// 		prob[i] = gaussian(X, theta[i], sigma[i]);
	// 	}

	// 	for i in range(self.nb_classes_):
	// 		np.prod(self._gaussian(X, self.theta_[i,:], self.sigma_[i,:]), axis=1)
 //        proba = np.column_stack([np.prod(self._gaussian(X, self.theta_[i,:], self.sigma_[i,:]), axis=1) for i in range(self.nb_classes_)])
        
 //        return proba/np.sum(proba, axis=1).reshape(-1,1)

		return X;
	}

	public int[] predict(double[][] X) {
		// Classify each example in X

		double[][] prob = predictProba(X);
		int[] yHat = new int[X.length];

		for (int i = 0; i < X.length; i++) {
			yHat[i] = classes[argmax(prob[i])];
		}
		
		return yHat;
	}

	public double score(double[][] X, double[] y) {
		// Return the accuracy of the current model on data X, y

		assert (X.length == y.length) : "X and y must contain the same number of examples.";

		int[] yHat = predict(X);
		int nbGoodDecisions = 0;
		for (int i = 0; i < y.length; i++) {
			if (yHat[i] == y[i]) {
				nbGoodDecisions += 1;
			}
		}
        return nbGoodDecisions/y.length;
	}

	public double[][] getMeans() {
		return this.theta;
	}

	public double[][] getStandardDeviations() {
		return this.sigma;
	}

	public double[] getClassPriors() {
		return this.classPriors;
	}

	public int[] getClassCounts() {
		return this.classCounts;
	}

	public void setMeans(double[][] means) {
		this.theta = means;
		this.fitted = false; // Since the internal state is not known, we can't allow partial training...
	}

	public void setStandardDeviations(double[][] stds) {
		this.sigma = stds;
		this.fitted = false; // Since the internal state is not known, we can't allow partial training...
	}

	public void setClassPriors(double[] classPriors) {
		this.classPriors = classPriors;
		this.fitted = false; // Since the internal state is not known, we can't allow partial training...
	}

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

	private int[] count(int[] numbers, int[] like) {
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
		for (int i : like){
			for (int j : numbers) {
			   if (i == j){
			   		counts[i]++;
			   }
			}
		}

		return counts;
	}

	private int argmax(double[] x) {
		// Return the index of the element with the highest value in x

		double max = x[0];
		int maxInd = 0;
		for (int i = 1; i < x.length; i++) {
		    if (x[i] > max) {
		      max = x[i];
		      maxInd = i;
		    }
		}
		return maxInd;
	}

	public void print() {
		// Print the current state of the model
		System.out.println("Classes: "+Arrays.toString(this.classes));
		System.out.println("Number of classes: "+this.nbClasses);
		System.out.println("Number of features: "+this.nbFeats);
		System.out.println("Class counts: "+Arrays.toString(getClassCounts()));
		System.out.println("Class priors: "+Arrays.toString(getClassPriors()));
		System.out.println("Sums: "+Arrays.deepToString(this.sum));
		System.out.println("Sums of squares: "+Arrays.deepToString(this.sumSquares));
		System.out.println("Means: "+Arrays.deepToString(getMeans()));
		System.out.println("Standard deviations: "+Arrays.deepToString(getStandardDeviations()));
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