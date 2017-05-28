import java.util.Arrays;
import java.lang.Math;
import java.util.*;
import java.util.stream.*;
import org.apache.commons.lang3.ArrayUtils;


public class GaussianNaiveBayesClassifier {

	private boolean fitted;

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
		// Gaussian Naive Bayes classifier.
		//
		// A Gaussian Naive Bayes classifier that can be trained offline or 
		// online, and then used for prediction. It accepts any number of 
		// classes and features.
		// The API was inspired by sklearn's:
		// http://scikit-learn.org/stabl/modules/generated/sklearn.naive_bayes.GaussianNB.html#sklearn.naive_bayes.GaussianNB
		//
		// Attributes:
		// 	fitted: True if the model has been fitted
		// 	classes: list of the integer identifier of each class for which the
		// 		model has been trained
		//  nbClasses: number of classes for which the model has been trained
		// 	nbFeats: number of features
		//  classCounts: number of examples seen by class
		//  sum: used internally to update the Gaussian models (sum of all seen
		//  	examples)
		//  sumSquares: used internally to update the Gaussian models (sum of 
		//		squares of all seen examples)
		//	theta: means of the Gaussian models [nbClasses, nbFeats]
		//  sigma: variances of the Gaussian models [nbClasses, nbFeats]
		//  classPriors: prior probability of each class, computed using the 
		//		number of examples seen for each class during training
		//
		// TODO:
		//  Implement decision boundary method?

		fitted = false;
	}

	public void fit(double[][] X, int[] y) {
		// Fit the model.
		//
		// Args:
		// 	X: training data, [nbExamples, nbFeatures]
		//  y: labels [nbExamples]
  		//
  		// Note: Calling `fit()` overwrites previous information. Use 
  		// `partial_fit()` to update the model with new training data.

		// If model has already been trained, re-initialize parameters
		this.fitted = false;
		partialFit(X,y);
	}

	public void partialFit(double[][] X, int[] y) {
		// Fit or update the model.
		//
		// Fit or update the model. If the model has already been trained, this
		// will update the parameters instead of computing them from scratch.
		//
		// Args:
		// 	X: training data, [nbExamples, nbFeatures]
		//  y: labels [nbExamples]
		//
		// Using `partialFit()` allows to update the model given new data.

		assert (X.length == y.length) : 
			"X and y must contain the same number of examples.";

		// If model has not been trained yet, initialize parameters
		if (!this.fitted) {
			this.classes = unique(y);
			this.nbClasses = this.classes.length;
			this.nbFeats = X[0].length;

			this.classCounts = new int[this.nbClasses];
			this.classPriors = new double[this.nbClasses];
			this.sum = new double[this.nbClasses][this.nbFeats];
			this.sumSquares = new double[this.nbClasses][this.nbFeats];
			this.theta = new double[this.nbClasses][this.nbFeats];
			this.sigma = new double[this.nbClasses][this.nbFeats];
		}

		int[] newClassCounts = count(y,this.classes);

		// Compute internal variable and model parameters for each class
		for (int i = 0; i < this.nbClasses; i++) {
			classCounts[i] += newClassCounts[i];

			for (int k = 0; k < this.nbFeats; k++) {
				// Update sum and sum of squares
				for (int j = 0; j < X.length; j++) {
					if (y[j] == this.classes[i]) {
						this.sum[i][k] += X[j][k];
						this.sumSquares[i][k] += X[j][k] * X[j][k];
					}
				}
				// Update theta and sigma 
				this.theta[i][k] = this.sum[i][k] / this.classCounts[i];
				this.sigma[i][k] = this.sumSquares[i][k] / this.classCounts[i] 
								   - this.theta[i][k] * theta[i][k];
			}
		}

		// Update class priors
		int nbExamplesSeen = 0;
		for (int i = 0; i < this.nbClasses; i++) {
			nbExamplesSeen += classCounts[i];
		}
		for (int i = 0; i < this.nbClasses; i++) {
			this.classPriors[i] = (double) classCounts[i]/nbExamplesSeen;
		}

		this.fitted = true;
	}

	public double[][] predictProba(double[][] X) {
		// Compute the posterior probability.
		//
		// Compute the posterior probability of data X given the learned model
		// parameters.
		//
		// Args:
		//  X: data for which to compute the posterior probability, 
		// 		[nbExamples, nbFeatures]
		//
		// Returns:
		//  posterior probability of each class for each example in X,
		//		[nbExamples, nbClasses]
		//
		// TODO:
		// - Add option to use classPriors

		double[][] prob = new double[X.length][this.nbClasses];
		double partition = 0;

		for (int i = 0; i < X.length; i++) {
			partition = 0;
			for (int j = 0; j < this.nbClasses; j++) {
				prob[i][j] = 1;
				// Compute joint pdf of example i
				for (int k = 0; k < X[i].length; k++) {
					prob[i][j] *= gaussian(X[i][k], this.theta[j][k], 
										   this.sigma[j][k]);
				}
				partition += prob[i][j]; // Compute the partition function
			}
			// Normalize the pdfs so prob sums to 1 for each example
			for (int j = 0; j < this.nbClasses; j++) {
				prob[i][j] /= partition; 
			}
		}

		return prob;
	}

	public int[] predict(double[][] X) {
		// Classify examples.
		//
		// Classify examples X given the learned model parameters.
		//
		// Args:
		//  X: data to classify, [nbExamples, nbFeatures]
		//
		// Returns:
		//  predicted labels, [nbExamples]

		double[][] prob = predictProba(X);
		int[] yHat = new int[X.length];

		for (int i = 0; i < X.length; i++) {
			yHat[i] = this.classes[argmax(prob[i])];
		}
		
		return yHat;
	}

	public double score(double[][] X, int[] y) {
		// Estimate the accuracy of the current model.
		//
		// Estimate the accuracy of the current model on data X, y.
		//
		// Args:
		//  X: data to test on, [nbExamples, nbFeatures]
		//  y: labels for X [nbExamples]
		//
		// Returns:
		//  accuracy

		assert (X.length == y.length) : 
			"X and y must contain the same number of examples.";

		int[] yHat = predict(X);
		int nbGoodDecisions = 0;
		for (int i = 0; i < y.length; i++) {
			if (yHat[i] == y[i]) {
				nbGoodDecisions += 1;
			}
		}
        return (double) nbGoodDecisions/y.length;
	}

	public double[][] getMeans() {
		return this.theta;
	}

	public double[][] getVariances() {
		return this.sigma;
	}

	public double[] getClassPriors() {
		return this.classPriors;
	}

	public int[] getClassCounts() {
		return this.classCounts;
	}

	public void setMeans(double[][] means) {
		// Set the means of the model.
		//
		// Set the means of the model. This makes it possible to load the
		// parameters of a model that was trained previously. However, since the 
		// internal state is unknown (sum, sumSquares, classCounts), we can't 
		// allow partial training.

		this.theta = means;
		this.fitted = false; 
	}

	public void setVariances(double[][] vars) {
		// Set the variances of the model.
		//
		// Set the variances of the model. This makes it possible to load the 
		// parameters of a model that was trained previously. However, since the
		// internal state is unknown (sum, sumSquares, classCounts), we can't 
		// allow partial training.

		this.sigma = vars;
		this.fitted = false; 
	}

	public void setClassPriors(double[] classPriors) {
		// Set the class priors of the model.
		//
		// Set the class priors of the model. This makes it possible to 
		// load the parameters of a model that was trained previously. However, 
		// since the internal state is unknown (sum, sumSquares, classCounts), 
		// we can't allow partial training.

		this.classPriors = classPriors;
		this.fitted = false; 
	}

	// public double[][] decisionBoundary() {
	// 	// ...
	// }

	public int[] rankFeats() {
		// List the feature indices by decreasing discriminative power.
		//
		// Returns:
		//  list of indices

		double[] coeffs = computeFeatDiscrimPower();

		int[] featInd = new int[this.nbFeats];
		for (int i = 0; i < this.nbFeats; i++){
			featInd[i] = argmax(coeffs);
			coeffs[featInd[i]] = -1;
		}
		return featInd;

	}

	public double[] computeFeatDiscrimPower() {
		// Compute the discriminative power of each feature.
		//
		// Compute the discriminative power of each feature using the 
		// Battacharyya distance. This only works for binary classification, and 
		// takes only one feature at a time into consideration.
		// 1 -> perfectly discriminative
		// 0 -> not discriminative at all
		//
		// Returns:
		//  list of feature importance for each feature
		//

		assert (this.nbFeats == 2) : 
			"Feature importance currently only supports binary classification.";

		double[] coeffs = new double[this.nbFeats]; 
		for (int i = 0; i < this.nbFeats; i++) {
			coeffs[i] = 1 - battacharyyaCoefficient(theta[0][i], sigma[0][i], 
													theta[1][i], sigma[1][i]);
		}
		return coeffs;
	}

	private double battacharyyaCoefficient(double mu1, double var1, double mu2,  
										   double var2) {
		// Battacharyya distance and coefficient between two univariate Gaussians.
		//
		// A coefficient of 0 means no overlap, while a coefficient of 1 means
		// perfect overlap.
		//
		// Args:
		//  mu1 (double): mean of the first gaussian
		//  var1 (double): variance of the first gaussian
		//  mu2 (double): mean of the second gaussian
		//  var2 (double): variance of the second gaussian
		//
		// Returns:
		//  (double): Battacharyya coefficient

		double distance = Math.log((var1/var2 + var2/var1 + 2)/4)/4 + 
						  Math.pow(mu1 - mu2, 2)/(var1 + var2)/4;
		return Math.exp(-1*distance);
	}

	private double gaussian(double x, double mu, double var) {
		// Compute the Gaussian pdf.
		//
		// Compute the univariate Gaussian pdf of mean `mu` and variance `var`
		//  for point `x`.
		//
		// Args:
		//  x: point for which to evaluate the pdf
		//  mu: mean of the univariate Gaussian
		//  var: variance of the univariate Gaussian
		//
		// Returns:
		//  pdf of point `x`
		
		x -= mu;
		return Math.exp(-x*x / (2*var)) / (Math.sqrt(2 * Math.PI * var));
	}

	private double[][] gaussian(double[][] X, double[] mu, double[] var) {
		// Compute the Gaussian pdf.
		//
		// Compute the Gaussian pdfs for multiple points and features at once.
		// This is a helper function to simplify the use of gaussian() above
		// on multiple points and features at once. 
		//
		// Args:
		//  X: matrix of shape [nbExamples, nbFeatures]
		//  mu: means of the univariate Gaussians, [nbFeatures]
		//  var: variances of the univariate Gaussians, [nbFeatures]
		//
		// Returns:
		//  pdfs of X, [nbExamples, nbFeatures]

		double[][] g = new double[X.length][mu.length];
		for (int j = 0; j < mu.length; j++){
			for (int i = 0; i < X.length; i++){
				g[i][j] = gaussian(X[i][j], mu[j], var[j]);
			}
		}	
		return g;
	}

	private int[] unique(int[] numbers) {
		// Find unique elements in array.
		//
		// Args:
		// 	numbers: array for which to find unique values
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
		// Count the number of occurences of a specific value in an array.
		//
		// Args:
		// 	numbers: list of integers in which to look for 
		// 	like: integers to look for
		//
		// Returns:
		// 	number of occurences for each desired element
		//
		// TODO: Make a more efficient version?

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
		// Return the index of the element with the highest value in x.
		//
		// Args:
		//  x: array
		//
		// Returns:
		//  index of the element with the highest value in x

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
		// Print the current state of the model.
		if (this.fitted) {
			System.out.println(" ");
			System.out.println("Summary of GaussianNaiveBayesClassifier");
			System.out.println("=======================================");
			System.out.println(" ");
			System.out.println("Classes: "+Arrays.toString(this.classes));
			System.out.println("Number of classes: "+this.nbClasses);
			System.out.println("Number of features: "+this.nbFeats);
			System.out.println("Class counts: "+Arrays.toString(getClassCounts()));
			System.out.println("Class priors: "+Arrays.toString(getClassPriors()));
			System.out.println("Sums: "+Arrays.deepToString(this.sum));
			System.out.println("Sums of squares: "+Arrays.deepToString(this.sumSquares));
			System.out.println("Means: "+Arrays.deepToString(getMeans()));
			System.out.println("Variances: "+Arrays.deepToString(getVariances()));
			System.out.println("Discriminative power: "+
							   Arrays.toString(computeFeatDiscrimPower()));
			System.out.println("Feature ranking: "+Arrays.toString(rankFeats()));
			System.out.println(" ");
		}
		else {
			System.out.println("Model has not been fitted yet.");
		}
	}

	public static void main(String[] args) {

		GaussianNaiveBayesClassifier clf = new GaussianNaiveBayesClassifier();

		// Make initial training set
		double[][] X_train = new double[][]{{1, 2},
									   		{4, 4},
									  		{4, 6},
									  		{7, 8},
									 		{8, 20},
									  		{9, 30}};
		int[] y_train = {0, 0, 0, 0, 1, 1};

		// Make second training set for update
		double[][] X_train2 = new double[][]{{2, 3},
									   		 {5, 5},
									  		 {5, 7},
									  		 {8, 9},
									 		 {9, 21},
									  		 {10, 31}};
		int[] y_train2 = {0, 0, 0, 0, 1, 1};

		// Make test set
		double[][] X_test = new double[][]{{0, 0},
										   {4, 5},
										   {10, 20},
										   {10, 115}};
		int[] y_test = {0, 0, 1, 1};

		// Fit initial model
		clf.fit(X_train, y_train);
		clf.print();

		// Update model
		clf.partialFit(X_train2, y_train2);
		clf.print();

		// Train model from scratch with new data instead
		clf.fit(X_train2, y_train2);
		clf.print();

		// Predict probability
		double[][] proba = clf.predictProba(X_test);
		System.out.println("Probability: "+Arrays.deepToString(proba));

		// Predict
		int[] yHat = clf.predict(X_test);
		System.out.println("Prediction: "+Arrays.toString(yHat));

		// Score
		double acc = clf.score(X_test, y_test);
		System.out.println("Accuracy: "+acc);
		}
}