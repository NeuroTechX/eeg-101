import java.util.Arrays; // For printing arrays when debugging

public class CircBuffer2D {
    // This class implements a circular (or ring) buffer to hold
    // the most recent values of a 2D time series efficiently.
	
	private int bufferLength;
	private int nbCh;
    private int nbBins;
	private int index;
	private int pts;
	private double[][][] buffer;

	public CircBuffer2D(int n, int m, int l) {
        bufferLength = n;
        nbCh = m;
        nbBins = l;

        index = 0;
        pts = 0;
        buffer = new double[bufferLength][nbCh][nbBins];
    }

    public void update(double[][] newData) {

    	if (newData.length == nbCh && newData[0].length == nbBins) {
	    	buffer[index] = newData;
	    	index++;
	    	pts++;
	    	if (index >= bufferLength) { index = 0;}
    	} else {
    		System.out.println("All channels and bins must be updated at once.");
    	}
    }

    public double[][][] extract(int nbSamples) {

    	int extractIndex;
    	double[][][] extractedArray = new double[nbSamples][nbCh][nbBins];

    	for(int i = 0; i < nbSamples; i++) {
    		extractIndex = mod(index - nbSamples + i, bufferLength);
    		extractedArray[i] = buffer[extractIndex];
    	}

    	return extractedArray;
    }

    public double[][] mean() {
        // Compute the mean of the buffer across epochs (1st dimension of `buffer`)

        double[][] bufferMean = new double[nbCh][nbBins];

        for (int i = 0; i <  bufferLength; i++) {
            for (int c = 0; c <  nbCh; c++) { 
                for (int n = 0; n <  nbBins; n++) {
                    bufferMean[c][n] += buffer[i][c][n];
                }
            }
        }

        for (int c = 0; c <  nbCh; c++) { 
            for (int n = 0; n <  nbBins; n++) {
                bufferMean[c][n] /= bufferLength;
            }
        }

        return bufferMean;

    }

    public int getPts() {
        return pts;
    }

    public void resetPts() {
    	pts = 0;
    }

    public void print() {
    	System.out.println(Arrays.deepToString(buffer));
    }

    private int mod(int a, int b) {
    	// Modulo operation that always return a positive number
    	int c = a % b;
    	return (c < 0) ? c + b : c;
    }


    public static void main(String[] args ) {

    	// Create test buffer
        int testBufferLength = 5;
    	int testNbCh = 4;
        int testNbBins = 3;
    	CircBuffer2D testBuffer = new CircBuffer2D(testBufferLength,testNbCh,testNbBins);

    	// Update buffer a few times with fake data
    	double[][] fakeSamples = new double[][]{{0.,1.,2.}, {3,4,5}, {6,7,8}, {9,10,11}};
    	int nbUpdates = 3;
    	for(int i = 0; i < nbUpdates; i++){
    		testBuffer.update(fakeSamples);
    	}

    	// Print buffer
    	testBuffer.print();

    	// Extract latest samples from buffer
    	double[][][] testExtractedArray = testBuffer.extract(4);
    	System.out.println(Arrays.deepToString(testExtractedArray));

    	// Reset number of collected points
    	testBuffer.resetPts();

        // Print mean of buffer
        double[][] bufferMean = testBuffer.mean();
        System.out.println(Arrays.deepToString(bufferMean));


    }

}